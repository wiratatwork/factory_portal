using FactoryPortal.Backend.Verification;

var connectionString = args.ElementAtOrDefault(0)
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? "Host=localhost;Port=5433;Database=factory_portal;Username=factory;Password=changeme";
var encryptionKey = args.ElementAtOrDefault(1)
    ?? Environment.GetEnvironmentVariable("Bff__TokenEncryption__Key")
    ?? "e2XtCYQce3rZcDVLxvotzlJpHUhhozophbB3WLAUGh0=";

await BffSessionStoreVerifier.RunAsync(connectionString, encryptionKey);
