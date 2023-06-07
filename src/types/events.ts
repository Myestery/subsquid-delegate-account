import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v9111 from './v9111'
import * as v9130 from './v9130'
import * as v9180 from './v9180'
import * as v9190 from './v9190'
import * as v9420 from './v9420'

export class BalancesTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    get isV1020(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '72e6f0d399a72f77551d560f52df25d757e0643d0192b3bc837cbd91b6f36b27'
    }

    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    get asV1020(): [Uint8Array, Uint8Array, bigint, bigint] {
        assert(this.isV1020)
        return this._chain.decodeEvent(this.event)
    }

    /**
     *  Transfer succeeded (from, to, value).
     */
    get isV1050(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
    }

    /**
     *  Transfer succeeded (from, to, value).
     */
    get asV1050(): [Uint8Array, Uint8Array, bigint] {
        assert(this.isV1050)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * Transfer succeeded.
     */
    get isV9130(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    }

    /**
     * Transfer succeeded.
     */
    get asV9130(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV9130)
        return this._chain.decodeEvent(this.event)
    }
}

export class ProxyProxyAddedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Proxy.ProxyAdded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proxy was added. \[delegator, delegatee, proxy_type, delay\]
     */
    get isV9111(): boolean {
        return this._chain.getEventHash('Proxy.ProxyAdded') === '4fac8b942563b27163fd7ece3d09cfc3b8410ae026ec89831bf64e9559cda031'
    }

    /**
     * A proxy was added. \[delegator, delegatee, proxy_type, delay\]
     */
    get asV9111(): [Uint8Array, Uint8Array, v9111.ProxyType, number] {
        assert(this.isV9111)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A proxy was added.
     */
    get isV9130(): boolean {
        return this._chain.getEventHash('Proxy.ProxyAdded') === 'a4f238e050a46a5e1a1a558cafb66167ab35f5eb690173826e77de0faccf7955'
    }

    /**
     * A proxy was added.
     */
    get asV9130(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v9130.ProxyType, delay: number} {
        assert(this.isV9130)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A proxy was added.
     */
    get isV9180(): boolean {
        return this._chain.getEventHash('Proxy.ProxyAdded') === 'ae1ed48cc2f067f62d457535342e3b24e80855b64afe26af25eeb2d17602cf36'
    }

    /**
     * A proxy was added.
     */
    get asV9180(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v9180.ProxyType, delay: number} {
        assert(this.isV9180)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A proxy was added.
     */
    get isV9420(): boolean {
        return this._chain.getEventHash('Proxy.ProxyAdded') === 'f4de253dbb3a2912e67e6bd54ef183234cf2db721e25f6dfea18839ba01d9b7d'
    }

    /**
     * A proxy was added.
     */
    get asV9420(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v9420.ProxyType, delay: number} {
        assert(this.isV9420)
        return this._chain.decodeEvent(this.event)
    }
}

export class ProxyProxyRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Proxy.ProxyRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proxy was removed.
     */
    get isV9190(): boolean {
        return this._chain.getEventHash('Proxy.ProxyRemoved') === 'ae1ed48cc2f067f62d457535342e3b24e80855b64afe26af25eeb2d17602cf36'
    }

    /**
     * A proxy was removed.
     */
    get asV9190(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v9190.ProxyType, delay: number} {
        assert(this.isV9190)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A proxy was removed.
     */
    get isV9420(): boolean {
        return this._chain.getEventHash('Proxy.ProxyRemoved') === 'f4de253dbb3a2912e67e6bd54ef183234cf2db721e25f6dfea18839ba01d9b7d'
    }

    /**
     * A proxy was removed.
     */
    get asV9420(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v9420.ProxyType, delay: number} {
        assert(this.isV9420)
        return this._chain.decodeEvent(this.event)
    }
}
