using Microsoft.AspNetCore.Mvc;
using Coin_Slot_Machine.Models;
using Coin_Slot_Machine.Repository;
using Coin_Slot_Machine.Interface;

[ApiController]
[Route("[controller]")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerRepository _repository;

    public PlayerController(IPlayerRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("winners")]
    public IActionResult GetWinners()
    {
        var winners = _repository.GetWinners();
        return Ok(winners);
    }

    [HttpGet("losers")]
    public IActionResult GetLosers()
    {
        var losers = _repository.GetLosers();
        return Ok(losers);
    }

    //kung existing si player
    [HttpGet("validate/{studentNumber}")]
    public IActionResult ValidatePlayer(string studentNumber)
    {
        bool exists = _repository.ValidatePlayer(studentNumber);
        return Ok(exists);
    }

    [HttpGet("recent-players")]
    public IActionResult RecentPlayers()
        => Ok(_repository.GetRecentPlayers());

    // 🔍 Individual search endpoints

    [HttpGet("by-studentnumber")]
    public IActionResult GetByStudentNumber([FromQuery] string studentNumber)
        => Ok(_repository.SearchPlayers(studentNumber, null, null, null, null));

    [HttpGet("by-firstname")]
    public IActionResult GetByFirstName([FromQuery] string firstName)
        => Ok(_repository.SearchPlayers(null, firstName, null, null, null));

    [HttpGet("by-lastname")]
    public IActionResult GetByLastName([FromQuery] string lastName)
        => Ok(_repository.SearchPlayers(null, null, lastName, null, null));

    [HttpGet("by-outcome")]
    public IActionResult GetByOutcome([FromQuery] string outcome)
        => Ok(_repository.SearchPlayers(null, null, null, outcome, null));

    [HttpGet("by-date")]
    public IActionResult GetByDate([FromQuery] DateTime datePlayed)
        => Ok(_repository.SearchPlayers(null, null, null, null, datePlayed));

    //para sa display
    [HttpGet("all")]
    public IActionResult GetAllPlayers()
    => Ok(_repository.GetAllPlayers());

    //add new player

    [HttpPost("register")]
    public IActionResult RegisterPlayer([FromBody] Player player)
    {
        if (string.IsNullOrEmpty(player.StudentNumber) ||
            string.IsNullOrEmpty(player.FirstName) ||
            string.IsNullOrEmpty(player.LastName))
        {
            return BadRequest("StudentNumber, FirstName, and LastName are required.");
        }

        if (_repository.ValidatePlayer(player.StudentNumber))
        {
            return Conflict("A player with this student number already exists.");
        }

        _repository.AddPlayer(player);
        return Ok("Player registered successfully.");
    }
    //get only first and last name for display
    [HttpGet("basic-info")]
    public IActionResult GetBasicInfo(string studentNumber)
    {
        var players = _repository.GetPlayersByStudentNumber(studentNumber);

        if (players == null || !players.Any())
        {
            return NotFound();
        }

        var result = players.Select(p => new
        {
            p.StudentNumber,
            p.FirstName,
            p.LastName
        });

        return Ok(result);
    }

    // update outcome every round

    [HttpPost("UpdateGameResult")]

    public IActionResult UpdateGameResult([FromBody] Player result)
    {
        var players = _repository.GetPlayersByStudentNumber(result.StudentNumber);
        var player = players.FirstOrDefault();

        if (player == null)
            return NotFound("Player not found.");

        player.Outcome = result.Outcome;
        player.DatePlayed = result.DatePlayed.ToLocalTime();

        _repository.UpdateGameResult(player.StudentNumber, player.Outcome, player.DatePlayed);
        return Ok("Result updated.");
    }
    //check if player can play
    [HttpGet("can-play/{studentNumber}")]
    public IActionResult CanPlayerPlay(string studentNumber)
    {
        var player = _repository.GetPlayersByStudentNumber(studentNumber).FirstOrDefault();

        if (player == null)
            return Ok(false);
        if (player.Outcome == "Lose" && player.DatePlayed.AddHours(3) > DateTime.Now)
                {
                    return Ok(false); 
                }
        return Ok(true);
    }

}