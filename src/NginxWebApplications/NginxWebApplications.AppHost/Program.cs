var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Web1>("web1");

builder.AddProject<Projects.Web2>("web2");

builder.Build().Run();
