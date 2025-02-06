using Microsoft.AspNetCore.Mvc;
using Autsim.Models.DTOs;
using Autsim.Services;
using System.Threading.Tasks;
using System;

namespace Autsim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PecsCardController : ControllerBase
    {
        private readonly PecsCardService _pecsCardService;
        private readonly ILogger<PecsCardController> _logger;

        public PecsCardController(PecsCardService pecsCardService, ILogger<PecsCardController> logger)
        {
            _pecsCardService = pecsCardService;
            _logger = logger;
        }

        /// <summary>
        /// Adds a new PecsCard.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddPecsCard([FromForm] PecsCardCreateDto pecsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (pecsDto == null)
            {
                return BadRequest("PecsCard data is required.");
            }

            try
            {
                var result = await _pecsCardService.AddPecsCardAsync(pecsDto);
                // Return a 201 Created status code with location header
                return CreatedAtAction(nameof(GetPecsCardById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid input data.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError(ex, "Error adding PecsCard.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves all PecsCards.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllPecsCards([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var (cards, totalCount) = await _pecsCardService.GetAllPecsCardsAsync(pageNumber, pageSize);
            return Ok(new { TotalCount = totalCount, Cards = cards });
        }

        /// <summary>
        /// Retrieves a specific PecsCard by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPecsCardById(int id)
        {
            try
            {
                var card = await _pecsCardService.GetPecsCardByIdAsync(id);
                if (card == null)
                    return NotFound(new { message = $"PecsCard with id {id} not found." });

                return Ok(card);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving PecsCard with id {id}.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates an existing PecsCard.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePecsCard(int id, [FromForm] PecsCardCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedCard = await _pecsCardService.UpdatePecsCardAsync(id, dto);
                if (updatedCard == null)
                    return NotFound(new { message = $"PecsCard with id {id} not found." });

                return Ok(updatedCard);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid input data.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating PecsCard with id {id}.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes a specific PecsCard by ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePecsCard(int id)
        {
            try
            {
                var isDeleted = await _pecsCardService.DeletePecsCardAsync(id);
                if (!isDeleted)
                    return NotFound(new { message = $"PecsCard with id {id} not found." });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting PecsCard with id {id}.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
