import { z } from "zod";

const environmentsSchema = z.object({
    ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    GRPC_PORT: z.coerce.number().int().positive().default(50051),
})

const _env = environmentsSchema.safeParse(process.env)

if (!_env.success) {
    const errors = z.treeifyError(_env.error)

    console.log(
        "❌ Invalid environment variables: \n",
        Object.entries(errors.properties || {})
            .map(([key, value]) => `${key}: ${value.errors.join(';')}`)
            .join("\n")
    )

    process.exit(1)
}

export const env = _env.data;