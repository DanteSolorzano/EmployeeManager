# Etapa 1: Compilación
# Usamos la imagen oficial del SDK de .NET 10 para compilar
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiamos el archivo de proyecto y restauramos las dependencias
COPY ["EmployeeApi/EmployeeApi/EmployeeApi.csproj", "EmployeeApi/EmployeeApi/"]
RUN dotnet restore "EmployeeApi/EmployeeApi/EmployeeApi.csproj"

# Copiamos el resto del código y compilamos en modo Release
COPY . .
WORKDIR "/src/EmployeeApi/EmployeeApi"
RUN dotnet publish "EmployeeApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Ejecución
# Usamos la imagen oficial de ASP.NET Core (más ligera) para ejecutar
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Exponemos el puerto que Render usará (generalmente el 8080)
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["dotnet", "EmployeeApi.dll"]