import * as ss58 from "@subsquid/ss58";

import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import {
  ProxyProxyAddedEvent,
  ProxyProxyRemovedEvent,
} from "./types/events";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { AccountData } from "./types/v1050";
import { BalancesAccountStorage } from "./types/storage";
import { Delegate, } from "./model";
import { lookupArchive } from "@subsquid/archive-registry";

type ProxyType =
  | "Any"
  | "NonTransfer"
  | "Governance"
  | "Staking"
  | "IdentityJudgement"
  | "CancelProxy"
  | "Auction"
  | "Society";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    //archive: lookupArchive("kusama", {release: "FireSquid"})

    // Use archive created by archive/docker-compose.yml
    archive: lookupArchive("kusama", { release: "FireSquid" }),
    chain: "wss://kusama-rpc.polkadot.io",
  })
  .addEvent("Proxy.ProxyAdded", {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true,
          fee: true,
        },
      },
    },
  } as const)
  .addEvent("Proxy.ProxyRemoved", {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true,
          fee: true,
        },
      },
    },
  } as const);
type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  let proxies = getProxies(ctx);
  let delegates: Delegate[] = [];
  let accountIds = new Set<string>();

  for (let t of [...proxies.added, ...proxies.removed]) {
    accountIds.add(t.delegatorId);
    accountIds.add(t.delegateeId);
  }
  // let accountIds = [];

  // let accounts = await ctx.store
  //   .findBy(Account, { id: In([...accountIds]) })
  //   .then((accounts: Account[]) => {
  //     return new Map(accounts.map((a) => [a.id, a]));
  //   });

  proxies.added.map((x) => {
    delegates.push(
      new Delegate({
        id: x.id,
        blockNumber: x.blockNumber,
        delegator: x.delegatorId,
        proxyType: x.proxyType,
        delegatee: x.delegateeId,
      })
    );
    console.log("Creating delegate with delegatee id: ", x.delegateeId);
  });

  await ctx.store.insert(delegates);

  // delete removed proxies
  await Promise.all(
    proxies.removed.map(async (x) => {
      let records = await ctx.store.findBy(Delegate, {
        delegator: x.delegatorId,
        delegatee: x.delegateeId,
      });
      if (records.length) {
        await ctx.store.remove(
          Delegate,
          records.map((r) => r.id)
        );
        console.log("Deleting delegate with delegatee id: ", x.delegateeId);
      }
    })
  );
});

interface ProxyCreateEvent {
  id: string;
  blockNumber: number;
  timestamp: Date;
  delegatorId: string;
  delegateeId: string;
  proxyType: string;
}

interface ProxyRemoveEvent {
  id: string;
  blockNumber: number;
  timestamp: Date;
  delegatorId: string;
  delegateeId: string;
  proxyType: string;
}

// function getAccount(m: Map<string, Account>, id: string): Account {
//   let acc = m.get(id);
//   if (acc == null) {
//     acc = new Account();
//     acc.id = id;
//     m.set(id, acc);
//   }
//   return acc;
// }

async function getAccountBalances(ctx: Ctx, ownersIds: Set<string>) {
  const storage = new BalancesAccountStorage(
    ctx,
    ctx.blocks[ctx.blocks.length - 1].header
  );
  const ownerAddresses = [...ownersIds];
  const ownerUintArrays = ownerAddresses.map(
    (x) => new Uint8Array(ss58.codec("kusama").decode(x))
  );
  let accountsData: AccountData[] = [];
  if (storage.isV1050) {
    accountsData = await storage.asV1050.getMany(ownerUintArrays);

    return new Map(ownerAddresses.map((v, i) => [v, accountsData[i].free]));
  }
}

function getProxies(ctx: Ctx): {
  added: ProxyCreateEvent[];
  removed: ProxyRemoveEvent[];
} {
  let proxies: ProxyCreateEvent[] = [];
  let removedProxies: ProxyRemoveEvent[] = [];
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name == "Proxy.ProxyAdded") {
        let e = new ProxyProxyAddedEvent(ctx, item.event);
        let rec: {
          delegator: Uint8Array;
          delegatee: Uint8Array;
          proxyType: ProxyType;
        };
        if (e.isV9180) {
          rec = {
            delegator: e.asV9180.delegator,
            delegatee: e.asV9180.delegatee,
            proxyType: e.asV9180.proxyType.__kind,
          };
        } else if (e.isV9111) {
          rec = {
            delegator: e.asV9111[0],
            delegatee: e.asV9111[1],
            proxyType: e.asV9111[2].__kind,
          };
        } else if (e.isV9130) {
          rec = {
            delegator: e.asV9130.delegator,
            delegatee: e.asV9130.delegatee,
            proxyType: e.asV9130.proxyType.__kind,
          };
        } else {
          throw new Error("Unsupported spec");
        }

        proxies.push({
          id: item.event.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          // delegatorId: ss58.codec("kusama").encode(rec.delegator),
          delegatorId: ss58.codec("kusama").encode(rec.delegator),
          delegateeId: ss58.codec("kusama").encode(rec.delegatee),
          proxyType: rec.proxyType,
        });
      }
      // get deleted proxies too
      if (item.name == "Proxy.ProxyRemoved") {
        let e = new ProxyProxyRemovedEvent(ctx, item.event);
        let rec: {
          delegator: Uint8Array;
          delegatee: Uint8Array;
          proxyType: ProxyType;
        };
        if (e.isV9190) {
          rec = {
            delegator: e.asV9190.delegator,
            delegatee: e.asV9190.delegatee,
            proxyType: e.asV9190.proxyType.__kind,
          };
        } else {
          throw new Error("Unsupported spec");
        }
        removedProxies.push({
          id: item.event.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          delegatorId: ss58.codec("kusama").encode(rec.delegator),
          delegateeId: ss58.codec("kusama").encode(rec.delegatee),
          proxyType: rec.proxyType,
        });
      }
    }
  }
  return { added: proxies, removed: removedProxies };
}
