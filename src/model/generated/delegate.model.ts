import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Delegate {
    constructor(props?: Partial<Delegate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: true})
    delegator!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    delegatee!: string | undefined | null

    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("text", {nullable: true})
    proxyType!: string | undefined | null
}
