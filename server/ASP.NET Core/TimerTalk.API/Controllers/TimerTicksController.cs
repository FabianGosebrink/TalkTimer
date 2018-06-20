using Microsoft.AspNetCore.Mvc;
using System;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimerTalk.API.Repositories;
using TimerTalk.API.Models;

namespace TimerTalk.API.Controllers
{
    [Route("api/talks/{talkId}/[controller]")]
    public class TimerTicksController : ControllerBase
    {
        private readonly ITimerTickRepository _timerTicksRepository;
        private readonly ITalksRepository _talksRepository;

        public TimerTicksController(ITimerTickRepository timerTicksRepository, ITalksRepository talksRepository)
        {
            _timerTicksRepository = timerTicksRepository;
            _talksRepository = talksRepository;
        }

        // GET api/food/{foodId}/ingredients
        [HttpGet]
        public IActionResult GetTimerTicksForTalk(Guid talkId)
        {
            if (_timerTicksRepository.GetSingle(talkId) == null)
            {
                return NotFound();
            }

            var allItems = _timerTicksRepository
                .GetAll()
                .Where(x => x.Talk.Id == talkId)
                .ToList();

            IEnumerable<TimerTickDto> viewModels = allItems
               .Select(x => Mapper.Map<TimerTickDto>(x));

            return Ok(viewModels);
        }

        // GET api/food/6/ingredients/3
        [HttpGet]
        [Route("{id}", Name = nameof(GetSingleTimerTicks))]
        public IActionResult GetSingleTimerTicks(Guid foodId, Guid id)
        {
            if (_timerTicksRepository.GetSingle(foodId) == null)
            {
                return NotFound();
            }

            var singleItem = _timerTicksRepository
                .GetAll()
                .Where(x => x.Talk.Id == foodId && x.Id == id)
                .FirstOrDefault();

            if (singleItem == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<TimerTickDto>(singleItem));
        }

        // POST api/food/6/ingredients
        [HttpPost]
        public IActionResult AddIngredientToFood(Guid talkId, [FromBody] TimerTickCreateDto timertickCreateDto)
        {
            if (timertickCreateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = _talksRepository.GetSingle(talkId);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var model = Mapper.Map<TimerTick>(timertickCreateDto);

            model.Talk = item;

            _timerTicksRepository.Add(model);

            if (!_timerTicksRepository.Save())
            {
                throw new Exception($"Creating a timertick for talk {talkId} failed on save.");
            }

            var toReturn = Mapper.Map<TimerTickDto>(model);

            return CreatedAtRoute(nameof(GetSingleTimerTicks), new { talkId, id = toReturn.Id }, toReturn);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateTimerTickForTalk(Guid talkId, Guid id, [FromBody] TimerTickUpdateDto timerTickUpdateDto)
        {
            if (timerTickUpdateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = _talksRepository.GetSingle(talkId);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var singleItem = _timerTicksRepository.GetAll().Where(x => x.Talk.Id == talkId && x.Id == id).FirstOrDefault();
            if (singleItem == null)
            {
                return NotFound();
            }

            Mapper.Map(timerTickUpdateDto, singleItem);

            _timerTicksRepository.Update(singleItem);

            if (!_timerTicksRepository.Save())
            {
                throw new Exception("Updating an ingredient failed on save.");
            }

            var updatedDto = Mapper.Map<TimerTickDto>(singleItem);

            return Ok(updatedDto);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Remove(Guid talkId, Guid id)
        {
            var item = _talksRepository.GetSingle(talkId);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var singleItem = _timerTicksRepository.GetAll().Where(x => x.Talk.Id == talkId && x.Id == id).FirstOrDefault();
            if (singleItem == null)
            {
                return NotFound();
            }

            _timerTicksRepository.Delete(id);

            if (!_timerTicksRepository.Save())
            {
                throw new Exception($"Deleting {id} for talk {talkId} failed on save.");
            }

            return NoContent();
        }
    }
}
