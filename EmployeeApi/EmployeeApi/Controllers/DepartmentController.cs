using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartmentController(EmployeeDBContext _db) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> getAll()
        {
            var deparments =await _db.Departments.AsNoTracking()
                .Select(e => new GetDepartmentResponse(e.DepartmentId, e.Name)).ToListAsync();
        return Ok(deparments);
        }

        [HttpPost]
        public async Task<IActionResult> create([FromBody] CreateDepartment request)
        {
            // 1. Instanciar la entidad con los datos del DTO
            var newDepartment = new Department
            {
                Name = request.name
            };

            // 2. Preparar la inserción en el contexto
            await _db.Departments.AddAsync(newDepartment);

            // 3. Ejecutar el guardado en AWS
            await _db.SaveChangesAsync(); 

            // 4. Devolver el nuevo registro confirmando el ID generado
            return Ok(new GetDepartmentResponse(newDepartment.DepartmentId, newDepartment.Name));
        }

    }
    
}
