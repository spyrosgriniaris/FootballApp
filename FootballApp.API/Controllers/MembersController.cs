using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Data;
using FootballApp.API.Dtos;
using FootballApp.API.Helpers;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace FootballApp.API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    
    public class MembersController : ControllerBase
    {
        private readonly IMemberRepository _memberRepo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public MembersController(IMemberRepository memberRepo, UserManager<User> userManager, IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _userManager = userManager;
            _memberRepo = memberRepo;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            // filtering for not showing loggedIn user's profile
            if(User.Identity.IsAuthenticated){
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var userFromRepo = await _memberRepo.GetUser(currentUserId, true);
                userParams.UserId = currentUserId;

                if (string.IsNullOrEmpty(userParams.Gender)) {
                    userParams.Gender = userFromRepo.Gender  == "male" ? "male" : "female";
                }
            }
            else {
                userParams.Gender = "male";
                userParams.UserId = 1;
            }
            

            var users = await _memberRepo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<MemberForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        //http://localhost:5000/api/members/1
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var isCurrentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var isCurrentUser = false;

            if (isCurrentUserId == id) {
                isCurrentUser = true;
            }

            var user = await _memberRepo.GetUser(id, isCurrentUser);

            var userToReturn = _mapper.Map<MemberForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, MemberForUpdateDto memberForUpdateDto) {
            // check if parameter's id equals the id that is part of the token
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _memberRepo.GetUser(id, true);

            _mapper.Map(memberForUpdateDto, userFromRepo);

            if (await _memberRepo.SaveAll()){
                return NoContent();
            }
            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId) {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if(id != currentUserId)
                return Unauthorized();

            var like = await _memberRepo.GetLike(id, recipientId);

            if(like != null)
                return BadRequest("You already like the user");
            
            if(await _memberRepo.GetUser(recipientId, false) == null)
                return NotFound();
            like = new Like {
                LikerId = id,
                LikeeId = recipientId
            };

            _memberRepo.Add<Like>(like);

            

            if(await _memberRepo.SaveAll()) {
                await UpdateTotalLikes(recipientId);
                return Ok();
            }
                
            
            return BadRequest("Failed to like user");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTotalLikes(int recipientId) {
            // update TotalLikes of recipient
            var recipient = _memberRepo.GetUser(recipientId, false);
            recipient.Result.TotalLikes = recipient.Result.TotalLikes + 1;
            if(await _memberRepo.SaveAll())
                return Ok();
            return BadRequest("Could not update TotalLikes");
        }

        // [HttpGet("GetGks")]
        // public IActionResult GetGks() {
        //     var gks = _context.Positions.Include(u=>u.User).Where(p=> p.Position == "Striker").Select(p=> p.UserId);
        //     return Ok(gks);
        // }
        
        [HttpGet("GetRanking")]
        public async Task<IActionResult> GetRanking([FromQuery] LikesParams likesParams) {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _memberRepo.GetUser(currentUserId, false);
            
            var users = await _memberRepo.GetUsersForLikes(likesParams);
     
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
  
        }

        [HttpGet("SearchUsers/{searchWord}")]
        public async Task<IActionResult> SearchUsers(string searchWord) {
            var searchResult = await _memberRepo.SearchUsers(searchWord);
            return Ok(searchResult);
        }
    
        [HttpGet("{id}/GetUserWithPositions")]
        public async Task<IActionResult> GetUserWithPositions(int userId) {
            var user = await _memberRepo.GetUserWithPositions(userId);
            return Ok(user);
        }

        [HttpPost("{userId}/UpdatePositions")]
        public async Task<IActionResult> UpdatePositions(int userId, PositionEditDto positionEditDto) {
            // user including position
            var user = await _memberRepo.GetUserWithPositions(userId);

            var userPositions = user.Positions.ToList();

            var positionsToReturn = _mapper.Map<IEnumerable<PositionNameReceiveDto>>(userPositions);

            List<string> userListPositions = new List<string>();

            foreach(var position in positionsToReturn) {
                userListPositions.Add(position.Position);
            }

            var positionsToUpdate = positionEditDto.PositionNames;

            var positionsToAdd = positionsToUpdate.Except(userListPositions).ToList();

            var positionsToRemove = userListPositions.Except(positionsToUpdate).ToList();

            // add new positions
            for(int i = 0; i < positionsToAdd.Count(); i++) {
                _memberRepo.Add<PlayerPosition>(new PlayerPosition {
                    UserId = user.Id,
                    Position = positionsToAdd[i]
                });
            }

            // remove positions that are not in user's checklist
            for(int i = 0; i < positionsToRemove.Count(); i++) {
                var pos = user.Positions.Where(u => u.UserId == user.Id && u.Position == positionsToRemove[i].ToString()).FirstOrDefault();
                user.Positions.Remove(pos);
            }
            await _memberRepo.SaveAll();

            return Ok(positionsToRemove);
        }
    }
}