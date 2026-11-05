using EmployeeApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.WebHost.UseUrls($"http://0.0.0.0:{Environment.GetEnvironmentVariable("PORT") ?? "8080"}");

builder.Services.AddControllers();

builder.Services.AddDbContext<EmployeeDBContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(opts =>
{
    opts.AddPolicy("mypolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin => 
        {
            if (string.IsNullOrEmpty(origin)) return false;
            
            // Obtenemos solo el dominio (ej. "localhost" o "mi-app.vercel.app")
            var host = new Uri(origin).Host; 
            
            // Permitimos desarrollo local y producción en Vercel
            return host == "localhost" || host.EndsWith(".vercel.app");
        })
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseStaticFiles();

app.UseCors("mypolicy");

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();