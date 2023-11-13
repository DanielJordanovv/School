using DogWeb.Data;
using DogWeb.Infrastructure.Data.Domain;
using DogWeb.Models.Dog;
using DogWeb.Services.Contracts;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DogWeb.Controllers
{
    public class DogsController : Controller
    {
        private readonly IDogService service;
        public DogsController(IDogService service)
        {
            this.service = service;
        }
        // GET: DogsController
        public async Task<IActionResult> Index(string searchStringBreed, string searchStringName)
        {
            List<DogAllViewModel> dogs = service.GetDogs(searchStringBreed, searchStringName)
            .Select(dogFromDb => new DogAllViewModel
            {
                Id = dogFromDb.Id,
                Name = dogFromDb.Name,
                Age = dogFromDb.Age,
                Breed = dogFromDb.Breed,
                Picture = dogFromDb.Picture,
            }).ToList();

            if (!String.IsNullOrEmpty(searchStringBreed) && !String.IsNullOrEmpty(searchStringName))
            {
                dogs = dogs.Where(d => d.Breed.Contains(searchStringBreed) && d.Name.Contains(searchStringName)).ToList();
            }
            else if (!String.IsNullOrEmpty(searchStringBreed))
            {
                dogs = dogs.Where(d => d.Breed.Contains(searchStringBreed)).ToList();
            }
            else if (!String.IsNullOrEmpty(searchStringName))
            {
                dogs = dogs.Where(d => d.Name.Contains(searchStringName)).ToList();
            }
            return View(dogs);
        }

        // GET: DogsController/Details/5
        public ActionResult Details(int id)
        {
            Dog item = service.GetDogById(id);
            if (item == null)
            {
                return NotFound();
            }
            DogDetailsViewModel dog = new DogDetailsViewModel()
            {
                Id = item.Id,
                Name = item.Name,
                Age = item.Age,
                Breed = item.Breed,
                Picture = item.Picture,
            };
            return View(dog);
        }

        // GET: DogsController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: DogsController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(DogCreateViewModel model)
        {
            if (this.ModelState.IsValid)
            {
                var created = service.Create(model.Name, model.Age, model.Breed, model.Picture);
                if (created)
                {
                    return RedirectToAction("Success");
                }
            }
            return this.View();
        }

        // GET: DogsController/Edit/5
        public ActionResult Edit(int id)
        {
            Dog item = service.GetDogById(id);
            if (item == null)
            {
                return NotFound();
            }
            DogCreateViewModel dog = new DogCreateViewModel
            {
                Id = id,
                Name = item.Name,
                Age = item.Age,
                Breed = item.Breed,
                Picture = item.Picture,
            };
            return View(dog);
        }
        // POST: DogsController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, DogEditViewModel model)
        {
            if (this.ModelState.IsValid)
            {
                var updated = service.UpdateDog(id, model.Name, model.Age, model.Breed, model.Picture);
                if (updated)
                {
                    return RedirectToAction("Index");
                }
            }
            return View(model);
        }
        public IActionResult Success()
        {
            return View();
        }
        // GET: DogsController/Delete/5
        public ActionResult Delete(int id)
        {
            Dog? item = service.GetDogById(id);
            if (item == null)
            {
                return NotFound();
            }
            DogEditViewModel dog = new DogEditViewModel()
            {
                Id = item.Id,
                Name = item.Name,
                Age = item.Age,
                Breed = item.Breed,
                Picture = item.Picture,
            };
            return View(dog);

        }

        // POST: DogsController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            var deleted = service.RemoveById(id);

            if (deleted)
            {
                return this.RedirectToAction("Index", "Dog");
            }
            else
            {
                return View();
            }
        }
    }
    }
