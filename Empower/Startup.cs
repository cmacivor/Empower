using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Empower.Authentication;
using Empower.Configuration;
using Empower.Services.Login;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Empower
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddScoped<AuthenticationState>();

            //TODO: configure the client like this instead of the way above. See the AssessmentTypeExperiment
            //Read this article for more information: https://www.stevejgordon.co.uk/httpclientfactory-named-typed-clients-aspnetcore
            //read this as well: https://stackoverflow.com/questions/51478525/httpclient-this-instance-has-already-started-one-or-more-requests-properties-ca
            //and this: https://www.talkingdotnet.com/3-ways-to-use-httpclientfactory-in-asp-net-core-2-1/
            services.AddHttpClient();

            services.AddHttpClient<ILoginService, LoginService>();


            //app settings file
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
             
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
