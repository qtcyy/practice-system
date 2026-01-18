using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using practice_system.Dtos;
using practice_system.Services.Problems;

namespace practice_system.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemService _problemService;

        public ProblemController(IProblemService problemService)
        {
            _problemService = problemService;
        }

        [HttpGet("get-set")]
        public async Task<IActionResult> GetProblemSet(CancellationToken ct)
        {
            // 从 JWT Claims 获取用户ID
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }
            var problemSet = await _problemService.GetProblemSet(userId, ct);
            var resp = new GetProblemSetResp("success", problemSet);

            return Ok(resp);
        }

        [HttpGet("get-problems/{problemSetId}")]
        public async Task<IActionResult> GetProblems(Guid problemSetId, CancellationToken ct)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }
            var problems = await _problemService.GetProblems(userId, problemSetId, ct);
            var resp = new GetProblemsResp("success", problems);

            return Ok(resp);
        }

        [HttpGet("get-detail/{problemId}")]
        public async Task<IActionResult> GetProblemDetail(Guid problemId, CancellationToken ct)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }
            var detail = await _problemService.GetProblemDetail(userId, problemId, ct);
            var resp = new GetProblemDetailResp("success", detail);

            return Ok(resp);
        }

        [HttpGet("get-incorrect/{problemSetId}")]
        public async Task<IActionResult> GetIncorrectProblems(Guid problemSetId, CancellationToken ct)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }
            var problems = await _problemService.GetIncorrectProblems(userId, problemSetId, ct);
            var resp = new GetIncorrectProblemsResp("success", problems);

            return Ok(resp);
        }
    }
}
