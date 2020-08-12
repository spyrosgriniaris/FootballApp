using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FootballApp.API.Data;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace FootballApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly UserManager<User> _userManager;

        public LogUserActivity(UserManager<User> userManager)
        {
            this._userManager = userManager;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // i wait for an action to be completed, in order to use result context
            var resultContext = await next();
            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var repo = resultContext.HttpContext.RequestServices.GetService<IMemberRepository>();
            var user = await repo.GetUser(userId, true);
            user.LastActive = DateTime.UtcNow.ToLocalTime();
            await repo.SaveAll();
        }
    }
}