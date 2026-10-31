namespace EmployeeApi.DTOs
{
    #region responses

    public record CreateEmployeeRequest(string Name, string Lastname1, string Lastname2, string Email, decimal Salary, IFormFile? Image, int DepartmentId);

    #endregion

    #region responses

    public record UpdateEmployeeRequest(int EmployeeId, string Name, string Lastname1, string Lastname2, string Email, decimal Salary, IFormFile? Image, int DepartmentId);

    #endregion

    #region responses

    public record GetEmployeeResponse(int EmployeeId, string Name, string Lastname1, string Lastname2, string Email, decimal Salary, string ImageUrl, string departmentName, int DepartmentId);

    #endregion
}
