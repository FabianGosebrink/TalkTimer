using Microsoft.AspNetCore.Mvc;
using System;
using AutoMapper;
using System.Linq;
using TimerTalk.API.Repositories;
using TimerTalk.API.Models;
using TimerTalk.API.Dto;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace TimerTalk.API.Controllers
{
    [Authorize]
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
        public IActionResult GetTimerTicksForTalk(int talkId)
        {
            if (_talksRepository.GetSingle(talkId, User.Identity.Name) == null)
            {
                return NotFound();
            }

            var allItems = _timerTicksRepository
                .GetAll(User.Identity.Name)
                .Where(x => x.Talk.Id == talkId)
                .OrderBy(x => x.Id)
                .ToList();

            var viewModels = allItems
               .Select(x => Mapper.Map<TimerTickDto>(x)).ToList();

            return Ok(viewModels);
        }

        // GET api/food/6/ingredients/3
        [HttpGet]
        [Route("{id}", Name = nameof(GetSingleTimerTicks))]
        public IActionResult GetSingleTimerTicks(int talkId, int id)
        {
            if (_timerTicksRepository.GetSingle(talkId, User.Identity.Name) == null)
            {
                return NotFound();
            }

            var singleItem = _timerTicksRepository
                .GetAll(User.Identity.Name)
                .Where(x => x.Talk.Id == talkId && x.Id == id)
                .FirstOrDefault();

            if (singleItem == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<TimerTickDto>(singleItem));
        }

        // POST api/food/6/ingredients
        [HttpPost]
        public IActionResult AddTimerTickToTalk(int talkId, [FromBody] TimerTickCreateDto timertickCreateDto)
        {
            if (timertickCreateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = _talksRepository.GetSingle(talkId, User.Identity.Name);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var model = Mapper.Map<TimerTick>(timertickCreateDto);

            model.Talk = item;
            model.UserId = User.Identity.Name;

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
        public IActionResult UpdateTimerTickForTalk(int talkId, int id, [FromBody] TimerTickUpdateDto timerTickUpdateDto)
        {
            if (timerTickUpdateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = _talksRepository.GetSingle(talkId, User.Identity.Name);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var singleItem = _timerTicksRepository.GetAll(User.Identity.Name).Where(x => x.Talk.Id == talkId && x.Id == id).FirstOrDefault();
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

        [HttpPut]
        [Route("{id}/multiple")]
        public IActionResult UpdateTimerTickForTalk(int talkId, int id, [FromBody] List<TimerTickUpdateDto> timerTickUpdateDtos)
        {
            if (timerTickUpdateDtos == null)
            {
                return BadRequest();
            }

            if (!timerTickUpdateDtos.Any())
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = _talksRepository.GetSingle(talkId, User.Identity.Name);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            foreach (var timerTickUpdateDto in timerTickUpdateDtos)
            {
                var singleItem = _timerTicksRepository.GetAll(User.Identity.Name).Where(x => x.Talk.Id == talkId && x.Id == id).FirstOrDefault();
                if (singleItem == null)
                {
                    return NotFound();
                }

                Mapper.Map(timerTickUpdateDto, singleItem);

                _timerTicksRepository.Update(singleItem);
            }

            if (!_timerTicksRepository.Save())
            {
                throw new Exception("Updating an ingredient failed on save.");
            }

            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Remove(int talkId, int id)
        {
            var item = _talksRepository.GetSingle(talkId, User.Identity.Name);

            if (item == null)
            {
                return NotFound("Not Found");
            }

            var singleItem = _timerTicksRepository.GetAll(User.Identity.Name).Where(x => x.Talk.Id == talkId && x.Id == id).FirstOrDefault();
            if (singleItem == null)
            {
                return NotFound();
            }

            _timerTicksRepository.Delete(id, User.Identity.Name);

            if (!_timerTicksRepository.Save())
            {
                throw new Exception($"Deleting {id} for talk {talkId} failed on save.");
            }

            return NoContent();
        }
    }
}
