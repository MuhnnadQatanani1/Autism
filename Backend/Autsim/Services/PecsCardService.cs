using Autsim.Models;
using Autsim.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Autsim.Services
{
    public class PecsCardService
    {
        private readonly DataContext _context;

        public PecsCardService(DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adds a new PecsCard along with its associated image.
        /// </summary>
        public async Task<PecsCardDto> AddPecsCardAsync(PecsCardCreateDto pecsCardCreateDto)
        {
            if (pecsCardCreateDto == null)
                throw new ArgumentNullException(nameof(pecsCardCreateDto), "PecsCard data is required.");

            // Convert IFormFile to byte array for storage
            byte[] imageData;

            if (pecsCardCreateDto.Images != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await pecsCardCreateDto.Images.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }
            }
            else
            {
                throw new ArgumentException("Image is required.", nameof(pecsCardCreateDto.Images));
            }

            // Create a new PecsCard object
            var pecsCard = new PecsCard
            {
                Name = pecsCardCreateDto.Name,
                CreationTime = DateTime.UtcNow,
                Image = new PecsImage
                {
                    ImageData = imageData
                }
            };

            // Add the card to the database
            _context.PecsCards.Add(pecsCard);
            await _context.SaveChangesAsync();

            // Return the created card as a DTO
            return new PecsCardDto
            {
                Id = pecsCard.Id,
                Name = pecsCard.Name,
                IFormFile = Convert.ToBase64String(imageData) // Encode to base64 for frontend
            };
        }

        /// <summary>
        /// Retrieves all PecsCards with their associated images.
        /// </summary>
        public async Task<(IEnumerable<PecsCardDto> cards, int totalCount)> GetAllPecsCardsAsync(int pageNumber = 1, int pageSize = 10)
        {
            var totalCount = await _context.PecsCards.CountAsync();

            var cards = await _context.PecsCards
                .Include(pc => pc.Image)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var cardDtos = cards.Select(pc => new PecsCardDto
            {
                Id = pc.Id,
                Name = pc.Name,
                IFormFile = pc.Image?.ImageData != null ? Convert.ToBase64String(pc.Image.ImageData) : null
            });

            return (cardDtos, totalCount);
        }
        /// <summary>
        /// Retrieves a single PecsCard by its ID.
        /// </summary>
        public async Task<PecsCardDto> GetPecsCardByIdAsync(int id)
        {
            var pecsCard = await _context.PecsCards
                .Include(pc => pc.Image)
                .FirstOrDefaultAsync(pc => pc.Id == id);

            if (pecsCard == null)
                return null;

            return new PecsCardDto
            {
                Id = pecsCard.Id,
                Name = pecsCard.Name,
                IFormFile = pecsCard.Image?.ImageData != null ? Convert.ToBase64String(pecsCard.Image.ImageData) : null
            };
        }

        /// <summary>
        /// Updates an existing PecsCard and its associated image.
        /// </summary>
        public async Task<PecsCardDto> UpdatePecsCardAsync(int id, PecsCardCreateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "PecsCard data is required.");

            var pecsCard = await _context.PecsCards
                .Include(pc => pc.Image)
                .FirstOrDefaultAsync(pc => pc.Id == id);

            if (pecsCard == null)
                return null;

            pecsCard.Name = dto.Name;

            if (dto.Images != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await dto.Images.CopyToAsync(memoryStream);
                    pecsCard.Image.ImageData = memoryStream.ToArray();
                }
            }
            else
            {
                throw new ArgumentException("Image is required for update.", nameof(dto.Images));
            }

            await _context.SaveChangesAsync();

            return new PecsCardDto
            {
                Id = pecsCard.Id,
                Name = pecsCard.Name,
                IFormFile = Convert.ToBase64String(pecsCard.Image.ImageData)
            };
        }

        /// <summary>
        /// Deletes a PecsCard and its associated image.
        /// </summary>
        public async Task<bool> DeletePecsCardAsync(int id)
        {
            var pecsCard = await _context.PecsCards
                .Include(pc => pc.Image) // Include Image for cascade delete
                .FirstOrDefaultAsync(pc => pc.Id == id);

            if (pecsCard == null)
                return false;

            _context.PecsCards.Remove(pecsCard);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
