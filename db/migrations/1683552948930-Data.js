module.exports = class Data1683552948930 {
    name = 'Data1683552948930'

    async up(db) {
        await db.query(`CREATE TABLE "delegate" ("id" character varying NOT NULL, "delegator" text, "delegatee" text, "block_number" integer NOT NULL, "proxy_type" text, CONSTRAINT "PK_810516365b3daa9f6d6d2d4f2b7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_25db9ae8942c9609c3284b37b2" ON "delegate" ("delegator") `)
        await db.query(`CREATE INDEX "IDX_d858af58adfdc21c608ac2a6c0" ON "delegate" ("delegatee") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "delegate"`)
        await db.query(`DROP INDEX "public"."IDX_25db9ae8942c9609c3284b37b2"`)
        await db.query(`DROP INDEX "public"."IDX_d858af58adfdc21c608ac2a6c0"`)
    }
}
