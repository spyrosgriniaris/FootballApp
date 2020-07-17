using FootballApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballApp.API.Data
{
    public class DataContext : DbContext
    {
         public DataContext(DbContextOptions<DataContext> options) : base (options)
         {}
         
         public DbSet<Value> Values {get; set;}
         public DbSet<User> Users {get; set;}
    }
}