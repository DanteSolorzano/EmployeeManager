using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDBContext _db;
        private readonly IWebHostEnvironment _env;

        public EmployeeController(EmployeeDBContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        #region Helper methods
           private async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

            string uploadsFolder = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            string filePath = Path.Combine(uploadsFolder,uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return uniqueFileName;
        }
        private void DeleteImage(string? fileName)
        {
            if (string.IsNullOrEmpty(fileName)) return;
            string filePath = Path.Combine(_env.WebRootPath, "images", fileName);
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> getAll()
        {
            string baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            var employees = await _db.Employees.AsNoTracking()
                .Include(d => d.Department)
                .Select(e => new GetEmployeeResponse(
                    e.EmployeeId,
                    e.Name,
                    e.LastName1,
                    e.LastName2,
                    e.Email,
                    e.Salary,
                    string.IsNullOrEmpty(e.Image) ? $"{baseUrl}/images/default.png" : $"{baseUrl}/images/{e.Image}",
                    e.Department.Name,
                    e.Department.DepartmentId
                    )).ToListAsync();

            return Ok(employees);
        }

        [HttpGet]
        public async Task<IActionResult> getById(int id)
        {
            string baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            var employee = await _db.Employees.AsNoTracking()
                .Include(d => d.Department)
                .Where(e => e.EmployeeId == id)
                .Select(e => new GetEmployeeResponse(
                    e.EmployeeId,
                    e.Name,
                    e.LastName1,
                    e.LastName2,
                    e.Email,
                    e.Salary,
                    "",
                    e.Department.Name,
                    e.Department.DepartmentId
                    )).FirstOrDefaultAsync();

            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> create([FromForm]CreateEmployeeRequest request)
        {
            string fileName = await SaveImageAsync(request.Image);

            var employee = new Employee
            {
                Name = request.Name,
                LastName1 = request.Lastname1,
                LastName2 = request.Lastname2,
                Email = request.Email,
                Salary = request.Salary,
                Image = fileName,
                DepartmentId = request.DepartmentId
            };
            await _db.Employees.AddAsync(employee);
            await _db.SaveChangesAsync();


            return Ok( new {message = "Employee Added Succesfully"});
        }

        [HttpPut]
        public async Task<IActionResult> update([FromForm] UpdateEmployeeRequest request)
        {
            var employee = await _db.Employees.FindAsync(request.EmployeeId);
            employee!.Name = request.Name;
            employee!.LastName1 = request.Lastname1;
            employee!.LastName2 = request.Lastname2;
            employee!.Email = request.Email;
            employee!.Salary = request.Salary;
            employee!.DepartmentId = request.DepartmentId;

            if (request.Image != null)
            {
                DeleteImage(employee.Image);
                employee.Image = await SaveImageAsync(request.Image);
            }

            _db.Employees.Update(employee);
                await _db.SaveChangesAsync();

               return Ok(new { message = "Employee Updated Succesfully" });
        }

        [HttpDelete("{EmployeeId}")]
        public async Task<IActionResult> delete(int EmployeeId)
        {
            var employee = await _db.Employees.FindAsync(EmployeeId);

            if (employee!.Image != null) DeleteImage(employee.Image);
            
            _db.Employees.Remove(employee);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Employee Deleted Succesfully" });
        }
    }
}
