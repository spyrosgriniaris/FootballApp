using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Data;
using FootballApp.API.Data.Members;
using FootballApp.API.Dtos;
using FootballApp.API.Helpers;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FootballApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize(Roles = "Team")]
    public class TeamController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly ITeamRepository _teamRepo;
        public TeamController(UserManager<User> userManager, IMapper mapper, DataContext context, ITeamRepository teamRepo)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = context;
            _teamRepo = teamRepo;
        }
        [HttpPost("{id}/addRosterPlayer")]
        public async Task<IActionResult> AddRosterPlayer(int id, RosterPlayerForUpdateDto rosterPlayerForUpdateDto) {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if(id != currentUserId)
                return Unauthorized();
            var rosterPlayerToAdd = _mapper.Map<RosterPlayers>(rosterPlayerForUpdateDto);
            rosterPlayerToAdd.UserId = id;

            _teamRepo.Add<RosterPlayers>(rosterPlayerToAdd);
            
            if(await _teamRepo.SaveAll()) {
                return Ok(rosterPlayerToAdd);
            }
                
            return BadRequest("Failed to add roster player.");
        }

        [HttpGet("{teamId}/getRosterPlayers")]
        public async Task<IActionResult> GetRosterPlayers(int teamId, [FromQuery]TeamParams teamParams) {

            // var currentTeamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var rosterPlayers = await _teamRepo.GetRosterPlayers(teamParams, teamId);

            var rosterPlayersToReturn = _mapper.Map<IEnumerable<RosterPlayerForUpdateDto>>(rosterPlayers);

            Response.AddPagination(rosterPlayers.CurrentPage, rosterPlayers.PageSize, rosterPlayers.TotalCount, rosterPlayers.TotalPages);

            return Ok(rosterPlayersToReturn);
        }

        [HttpGet("{rosterPlayerId}/getRosterPlayer")]
        public async Task<IActionResult> GetRosterPlayer(int id) {
            var rosterPlayer = await _teamRepo.GetRosterPlayer(id);
            return Ok(rosterPlayer);
        }

        
    }
}