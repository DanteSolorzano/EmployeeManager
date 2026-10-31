namespace EmployeeApi.DTOs
{
    #region responses

    public record GetDepartmentResponse(int id, string name);

    public record CreateDepartment(string name);

    #endregion
}
