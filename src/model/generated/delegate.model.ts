import {Column as Column_, Entity as Entity_, Index as Index_, ManyToOne as ManyToOne_, PrimaryColumn as PrimaryColumn_} from "typeorm"

import {Account} from "./account.model"

@Entity_()
export class Delegate {
    constructor(props?: Partial<Delegate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    delegator!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    delegatee!: Account

    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("text", {nullable: true})
    proxyType!: string | undefined | null
   
    @Column_("text", {nullable: true})
    delegator_id?: string

    @Column_("text", {nullable: true})
    delegatee_id?: string 
}
