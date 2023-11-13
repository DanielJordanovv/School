using DogWeb.Data;

namespace DogWeb.Services
{
    public class DogService
    {
        private readonly ApplicationDbContext context;
        public DogService(ApplicationDbContext context)
        { }
    }
}