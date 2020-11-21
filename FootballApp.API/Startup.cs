using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Data;
using FootballApp.API.Data.Members;
using FootballApp.API.Helpers;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace FootballApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        
    private async Task CreateUserRoles(IServiceProvider serviceProvider)
    {
        var RoleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        
        IdentityResult roleResult;
        //Adding Admin Role
        var adminCheck = await RoleManager.RoleExistsAsync("Admin");
        var playerCheck = await RoleManager.RoleExistsAsync("Player");
        var teamCheck = await RoleManager.RoleExistsAsync("Team");
        var coachCheck = await RoleManager.RoleExistsAsync("Coach");
        if (!adminCheck)
        {
            //create the roles and seed them to the database
            var role = new Role();
            role.Name = "Admin";
            roleResult = await RoleManager.CreateAsync(role);
        }
        if (!playerCheck)
        {
            var role = new Role();
            role.Name = "Player";
            roleResult = await RoleManager.CreateAsync(role);
        }
        if (!teamCheck)
        {
            var role = new Role();
            role.Name = "Team";
            roleResult = await RoleManager.CreateAsync(role);
        }
        if (!coachCheck)
        {
            var role = new Role();
            role.Name = "Coach";
            roleResult = await RoleManager.CreateAsync(role);
        }
            //Assign Admin role to the main User here we have given our newly registered 
            //login id for Admin management
    }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Identity configuration
            IdentityBuilder builder = services.AddIdentityCore<User>(opt => {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();
            // end of identity configuration
            // for auth i need to add authorization and authentication in configure below
            

            // policy based auth
            services.AddAuthorization(options => {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("RequirePlayerRole", policy => policy.RequireRole("Player"));
                options.AddPolicy("RequireMemberRole", policy => policy.RequireRole("Member"));
            });

            services.AddControllers(options => {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                options.Filters.Add(new AuthorizeFilter(policy));
            }).AddNewtonsoftJson(opt => {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddDbContext<DataContext>(x => x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddAutoMapper(typeof(MemberRepository).Assembly);
            // add scoped makes an instance for every request
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IMemberRepository, MemberRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            services.AddScoped<LogUserActivity>();    
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,  IServiceProvider services)
        {
            if (env.IsDevelopment())  
            {
                // app.UseDeveloperExceptionPage();
            }
            else {
                // app.UseExceptionHandler(builder => {
                //     builder.Run(async context => {
                //         context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                //         var error = context.Features.Get<IExceptionHandlerFeature>();
                //         if(error != null){
                //             context.Response.AddApplicationError(error.Error.Message);
                //             await context.Response.WriteAsync(error.Error.Message);
                //         }

                //     });
                // });
                // app.UseHsts();
                
                app.UseHsts();
            }
            app.UseDeveloperExceptionPage();
            // app.UseHttpsRedirection();// enable sto publish
// ---------------------------------------------------------------------------
            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            
            app.UseAuthentication();
            app.UseAuthorization();
            

            // for publish
            app.UseDefaultFiles(); // psaxnei tin index.html
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                // endpoints.MapFallbackToController("Index", "Fallback");
            });

            CreateUserRoles(services).Wait();
        }
       
    }
}
