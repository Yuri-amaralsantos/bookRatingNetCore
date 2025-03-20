using System.Collections.Generic;
using UserAuthApi.Models;

namespace UserAuthApi.Services
{
    public interface IUserService
    {
        List<object> GetUserBooks(string username);
        bool AddBookToUser(string username, int bookId, out string message);
        bool RemoveBookFromUser(string username, int bookId, out string message);
    }
}
