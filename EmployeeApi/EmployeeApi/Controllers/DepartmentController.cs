using EmployeeApi.Data;
using EmployeeApi.DTOs;
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
    }
}
