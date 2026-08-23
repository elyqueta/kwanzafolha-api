declare module "node-pg-migrate" {
  export type MigrationBuilder =
    import("node-pg-migrate/dist/bundle/index.d.ts").MigrationBuilder;
  export type RunnerOption =
    import("node-pg-migrate/dist/bundle/index.d.ts").RunnerOption;
  export type RunMigration =
    import("node-pg-migrate/dist/bundle/index.d.ts").RunMigration;
  export const runner: (options: RunnerOption) => Promise<RunMigration[]>;
  export const MigrationBuilder: new () => MigrationBuilder;
  export const Migration: new (
    name: string,
    direction: "up" | "down",
    options?: any,
  ) => { up?: () => Promise<void>; down?: () => Promise<void> };
  export const PG_MIGRATE_LOCK_ID: number;
  export const PgLiteral: new (value: string) => { value: string };
  export const PgType: { [key: string]: string };
  export const escapeValue: (val: any) => string | number;
  export const isPgLiteral: (val: any) => boolean;
  export const jiti: any;
}
