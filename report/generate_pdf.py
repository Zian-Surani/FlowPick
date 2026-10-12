"""Generate an HTML version of the exact 5-page report with base64 embedded images and convert to PDF via headless Microsoft Edge."""
import os
import base64
import subprocess
import re

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REPORT_DIR = os.path.join(BASE_DIR, "report")
IMAGES_DIR = os.path.join(BASE_DIR, "images")

def get_base64_img(filename):
    path = os.path.join(IMAGES_DIR, filename)
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:image/png;base64,{data}"

img1 = get_base64_img("01-landing-page.png")
img2 = get_base64_img("05-rl-formulation-mdp.png")
img3 = get_base64_img("02-live-agent-telemetry.png")
img4 = get_base64_img("03-dynamic-simulation.png")
img5 = get_base64_img("04-training-convergence.png")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FlowPick — Academic Research & Evaluation Report</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 14mm 16mm 14mm 16mm;
  }}
  * {{
    box-sizing: border-box;
  }}
  body {{
    font-family: "Times New Roman", Times, serif;
    font-size: 11pt;
    line-height: 1.32;
    color: #111827;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }}
  .page {{
    width: 100%;
    height: 268mm;
    max-height: 268mm;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    page-break-inside: avoid;
    break-after: page;
    break-inside: avoid;
  }}
  .page:last-child {{
    page-break-after: avoid;
    break-after: avoid;
  }}
  .header-rule {{
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #6b7280;
    border-bottom: 0.75pt solid #d1d5db;
    padding-bottom: 2pt;
    margin-bottom: 6pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .footer-rule {{
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #6b7280;
    border-top: 0.75pt solid #d1d5db;
    padding-top: 2pt;
    margin-top: 4pt;
  }}
  h1 {{
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
    margin: 3pt 0 2pt 0;
    color: #0f172a;
    letter-spacing: 0.2px;
  }}
  .subtitle {{
    font-size: 9pt;
    font-weight: bold;
    text-align: center;
    color: #4f46e5;
    margin: 0 0 2pt 0;
    letter-spacing: 0.5px;
  }}
  .authors {{
    font-size: 9.5pt;
    text-align: center;
    margin-bottom: 6pt;
    color: #374151;
  }}
  .authors strong {{
    color: #111827;
  }}
  h2 {{
    font-size: 14pt;
    font-weight: bold;
    color: #111827;
    margin: 6pt 0 3pt 0;
    border-bottom: 0.5pt solid #e5e7eb;
    padding-bottom: 1pt;
  }}
  p {{
    text-align: justify;
    text-justify: inter-word;
    font-size: 11pt;
    margin: 0 0 4pt 0;
  }}
  .figure-box {{
    text-align: center;
    margin: 4pt 0;
  }}
  .figure-box img {{
    max-width: 95%;
    border-radius: 4px;
    border: 0.5pt solid #d1d5db;
  }}
  .figure-caption {{
    font-size: 8.5pt;
    font-style: italic;
    color: #4b5563;
    margin-top: 2pt;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 4pt 0;
    font-size: 9pt;
  }}
  th, td {{
    border: 0.5pt solid #cbd5e1;
    padding: 2.5pt 4pt;
    text-align: justify;
  }}
  th {{
    background-color: #f1f5f9;
    font-weight: bold;
    text-align: left;
    color: #0f172a;
  }}
  .eq-box {{
    background-color: #f8fafc;
    border-left: 2.5pt solid #4f46e5;
    padding: 3pt 6pt;
    margin: 3pt 0;
    font-size: 10pt;
    font-style: italic;
  }}
</style>
</head>
<body>

<!-- ================================= PAGE 1 ================================= -->
<div class="page">
  <div>
    <div class="header-rule">
      <span>FlowPick: Adaptive Warehouse Learning Agent</span>
      <span>Page 1 of 5</span>
    </div>
    <div class="subtitle">FUNDAMENTALS OF REINFORCEMENT LEARNING — TASK 2 LABORATORY ASSESSMENT</div>
    <h1>FLOWPICK: ADAPTIVE WAREHOUSE LEARNING AGENT USING TABULAR Q-LEARNING</h1>
    <div class="authors">
      <strong>Zian Rajeshkumar Surani</strong> (RA2311026050085) &nbsp;|&nbsp; 
      <strong>Vaishnavi Soni</strong> (RA2311026050070)<br>
      Department of Computer Science and Engineering &nbsp;|&nbsp; SRM Institute of Science and Technology
    </div>

    <h2>Executive Abstract</h2>
    <p>
      Modern order fulfillment facilities rely increasingly on Automated Guided Vehicles (AGVs) capable of self-directed corridor navigation without brittle pre-programmed trajectory scripts. This academic report presents FlowPick, a model-free Reinforcement Learning (RL) system driven by discrete tabular Q-Learning. Operating inside a discrete 2D warehouse grid with static storage rack obstacles, the autonomous agent iteratively discovers an optimal routing policy to collect inventory items from a pickup depot and deliver them to a dispatch terminal. Evaluated across extensive episodes, the system demonstrates empirical policy convergence, asymptotic reduction in step latency, and robust transition from unguided exploration to a deterministic optimal path achieving a 100% greedy delivery success rate.
    </p>

    <h2>1. Introduction & Operational Motivation</h2>
    <p>
      Intralogistics environments are inherently constrained: storage racks limit traversable space, corridor bottlenecks produce congestion, and inventory transport demands rapid, cost-optimal paths. Traditional search heuristics (such as static A* and Dijkstra algorithms) compute geometric shortest routes but require complete prior environmental graph knowledge and cannot naturally optimize parameterized multi-objective rewards. Reinforcement Learning re-frames warehouse dispatching as an autonomous Markovian trial-and-error game where the agent observes sensory states, selects directional actions, and updates expected future payoffs via scalar environmental rewards.
    </p>

    <div class="figure-box">
      <img src="{img1}" style="max-height: 78mm;" alt="FlowPick Landing Interface">
      <div class="figure-caption">Figure 1: FlowPick Landing & Assessment Interface showing core RL paradigms and academic evaluation credentials.</div>
    </div>
  </div>
  <div class="footer-rule">
    <span>Department of Computer Science & Engineering</span>
    <span>SRMIST — Academic RL Evaluation</span>
  </div>
</div>

<!-- ================================= PAGE 2 ================================= -->
<div class="page">
  <div>
    <div class="header-rule">
      <span>FlowPick: Adaptive Warehouse Learning Agent</span>
      <span>Page 2 of 5</span>
    </div>

    <h2>2. Markov Decision Process (MDP) Formulation</h2>
    <p>
      To establish mathematical convergence guarantees, the spatial warehouse environment is formulated as a discrete-time, finite-horizon Markov Decision Process (MDP) specified by the 5-tuple M = &lt;S, A, P, R, γ&gt;:
    </p>
    <p>
      <strong>• State Space (S):</strong> The warehouse floor is discretized into a 6×6 grid indexed by coordinates (r, c) with r, c ∈ {{0, ..., 5}}. A binary carrying status flag (has_package ∈ {{0, 1}}) records payload state. Every discrete environmental state is represented by the 3-tuple s = (r, c, has_package), yielding an unconstrained state cardinality of |S| = 6 × 6 × 2 = 72 states. Grid cells allocated to static storage racks are treated as non-traversable obstacle barriers.
    </p>
    <p>
      <strong>• Action Space (A):</strong> At each decision interval, the agent executes an action from four cardinal transitions: A = {{UP, DOWN, LEFT, RIGHT}}, corresponding to coordinate deltas: UP (Δr = -1, Δc = 0), DOWN (Δr = +1, Δc = 0), LEFT (Δr = 0, Δc = -1), and RIGHT (Δr = 0, Δc = +1).
    </p>
    <p>
      <strong>• Transition Dynamics (P):</strong> The transition function P(s' | s, a) is deterministic. Transitions attempting to cross grid borders or intersect shelf racks are intercepted: the agent remains at its current position (s' = s) and receives a collision penalty. Valid steps translate the agent to s' = (r + Δr, c + Δc, has_package'). Moving onto pickup station (0, 4) transitions has_package' ← 1.
    </p>

    <h2>3. Reward Signal Engineering</h2>
    <p>
      The scalar reward function R(s, a, s') provides the directional feedback shaping policy discovery. Numerical values are calibrated to balance terminal goals against movement costs:
    </p>

    <table>
      <thead>
        <tr>
          <th>Condition / Milestone</th>
          <th style="width: 20%;">Reward Signal</th>
          <th>Operational Function & Rationale</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Terminal Delivery</strong></td>
          <td>+100.0</td>
          <td>Awarded when package arrives at dispatch dock (5, 5). Successfully concludes episode.</td>
        </tr>
        <tr>
          <td><strong>Milestone Pickup</strong></td>
          <td>+20.0</td>
          <td>Granted upon arriving at package shelf (0, 4) without item. Updates agent sub-objective.</td>
        </tr>
        <tr>
          <td><strong>Movement Step Cost</strong></td>
          <td>-1.0</td>
          <td>Deducted per valid move to enforce time penalties and derive shortest path trajectories.</td>
        </tr>
        <tr>
          <td><strong>Looping / Delay Penalty</strong></td>
          <td>-5.0</td>
          <td>Deducted if revisiting any cell visited in the prior 4 steps, suppressing circular cycles.</td>
        </tr>
        <tr>
          <td><strong>Obstacle / Wall Collision</strong></td>
          <td>-10.0</td>
          <td>Penalizes attempts to bump into storage shelves {{(1,1), (1,2), (1,4), (3,1), (3,3), (3,4), (4,1)}}.</td>
        </tr>
      </tbody>
    </table>

    <div class="figure-box">
      <img src="{img2}" style="max-height: 52mm;" alt="Theoretical MDP Architecture">
      <div class="figure-caption">Figure 2: Formal MDP Interaction Cycle, Bellman Optimality formulation, and structural component taxonomy.</div>
    </div>
  </div>
  <div class="footer-rule">
    <span>Department of Computer Science & Engineering</span>
    <span>SRMIST — Academic RL Evaluation</span>
  </div>
</div>

<!-- ================================= PAGE 3 ================================= -->
<div class="page">
  <div>
    <div class="header-rule">
      <span>FlowPick: Adaptive Warehouse Learning Agent</span>
      <span>Page 3 of 5</span>
    </div>

    <h2>4. Tabular Q-Learning Algorithm & Bellman Optimality</h2>
    <p>
      FlowPick implements model-free off-policy Temporal Difference Q-Learning. The agent maintains an explicit lookup table Q: S × A → ℝ that maps every state-action pair to its expected discounted cumulative return. The state-action value is iteratively updated using the Bellman Optimality Equation:
    </p>

    <div class="eq-box">
      <strong>Standard Bellman TD Update:</strong><br>
      Q(s, a) ← Q(s, a) + α · [ r + γ · max_{{a' ∈ A}} Q(s', a') - Q(s, a) ]
    </div>
    <div class="eq-box">
      <strong>Terminal Transition Update:</strong><br>
      Q(s, a) ← Q(s, a) + α · [ r - Q(s, a) ]
    </div>

    <p>
      Here, α = 0.10 specifies the learning rate, governing the rate of belief revision upon experiencing Temporal Difference (TD) error δ_t = r + γ max_{{a'}} Q(s', a') - Q(s, a). The parameter γ = 0.95 defines the discount factor, ensuring future package delivery rewards are factored into early departure decisions.
    </p>
    <p>
      <strong>Exploration vs. Exploitation:</strong> Action selection during training utilizes an ε-greedy policy. With probability ε, the agent takes a random exploratory action; with probability 1 - ε, it exploits its current knowledge: a = argmax_{{a'}} Q(s, a'). Exploration decays exponentially after each completed episode via ε_{{k+1}} = max(ε_{{min}}, ε_k · λ), with ε_0 = 0.20, decay rate λ = 0.992, and ε_{{min}} = 0.05.
    </p>

    <h2>5. Software Architecture & Multi-Threaded Engine</h2>
    <p>
      The system employs a decoupled, asynchronous architecture. The backend (FastAPI + Python) executes the Q-Learning algorithm inside an isolated worker thread managed by a thread-safe <code>Trainer</code> engine. Mutex locking (<code>threading.Lock</code>) guarantees thread safety during simultaneous telemetry polling and state updates. The user interface (React 19 + TypeScript + Vite) polls the backend over REST endpoints at <code>http://localhost:8000</code>, ensuring fluid visualization without interrupting training computation.
    </p>

    <div class="figure-box">
      <img src="{img3}" style="max-height: 52mm;" alt="Live Warehouse Grid View">
      <div class="figure-caption">Figure 3: Live 6×6 Spatial Warehouse Grid displaying AGV coordinates, shelf obstacles, and sensory telemetry.</div>
    </div>
  </div>
  <div class="footer-rule">
    <span>Department of Computer Science & Engineering</span>
    <span>SRMIST — Academic RL Evaluation</span>
  </div>
</div>

<!-- ================================= PAGE 4 ================================= -->
<div class="page">
  <div>
    <div class="header-rule">
      <span>FlowPick: Adaptive Warehouse Learning Agent</span>
      <span>Page 4 of 5</span>
    </div>

    <h2>6. Simulation Dynamics & Real-Time Trajectory Execution</h2>
    <p>
      During real-time simulation, the AGV begins at the start dock (5, 0). It traverses northward along column 0 to circumvent storage shelf obstacles at (4, 1), (3, 1), and (1, 1), moves eastward along row 0 to reach the pickup station (0, 4), and then navigates southward through open corridors to reach the dispatch terminal at (5, 5). Visual breadcrumb trails highlight recent path coordinates, exposing loops or wall collisions.
    </p>

    <div class="figure-box">
      <img src="{img4}" style="max-height: 48mm;" alt="Dynamic Simulation Trajectory">
      <div class="figure-caption">Figure 4: Dynamic Trajectory Execution showing real-time agent path tracing, sensory action flags, and live reward accumulation.</div>
    </div>

    <h2>7. Empirical Convergence & Training Dynamics</h2>
    <p>
      Empirical training was evaluated over 250 episodes. Three distinct developmental phases characterize the agent's behavioral learning trajectory:
    </p>
    <p>
      <strong>• Phase 1: High-Entropy Exploration (Episodes 1 – 30):</strong> Characterized by high exploration (ε ≥ 0.15). The agent frequently bumps into shelf racks (-10) and reaches the 60-step timeout cutoff. Mean episode returns hover between -120 and -60, with success rates under 25%.
    </p>
    <p>
      <strong>• Phase 2: Bellman Value Propagation (Episodes 31 – 100):</strong> As deliveries occur, positive reward signals propagate backward toward the pickup dock and starting position. Delay penalties (-5) systematically extinguish cyclical loops, dropping average steps per run from 55+ to 20.
    </p>
    <p>
      <strong>• Phase 3: Policy Convergence (Episodes 101 – 250):</strong> The policy stabilizes around the shortest obstacle-free route. Under greedy evaluation (ε = 0), the agent achieves a 100% success rate with cumulative returns between +95 and +108.
    </p>

    <div class="figure-box">
      <img src="{img5}" style="max-height: 48mm;" alt="Training Convergence Curve">
      <div class="figure-caption">Figure 5: Empirical Learning Curve showing episode returns, 10-episode moving average, and convergence progress.</div>
    </div>
  </div>
  <div class="footer-rule">
    <span>Department of Computer Science & Engineering</span>
    <span>SRMIST — Academic RL Evaluation</span>
  </div>
</div>

<!-- ================================= PAGE 5 ================================= -->
<div class="page">
  <div>
    <div class="header-rule">
      <span>FlowPick: Adaptive Warehouse Learning Agent</span>
      <span>Page 5 of 5</span>
    </div>

    <h2>8. Verification & Automated Test Suite</h2>
    <p>
      A suite of 10 automated unit and integration tests was developed using Pytest and FastAPI TestClient to guarantee system reliability and mathematical correctness:
    </p>

    <table>
      <thead>
        <tr>
          <th>Automated Test Name</th>
          <th>Validation Scope & Assertion Target</th>
          <th style="width: 18%;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>test_environment_reset</code></td>
          <td>Validates initial coordinates (5,0), empty payload flag, and zero step counter.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_valid_movement</code></td>
          <td>Confirms single-cell directional translation and -1.0 movement cost deduction.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_invalid_movement_reward</code></td>
          <td>Verifies wall and storage shelf collision interception with -10.0 penalty.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_successful_terminal_condition</code></td>
          <td>Asserts +100 delivery reward and terminal completion upon dispatch arrival.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_q_value_update</code></td>
          <td>Validates Bellman TD update formula arithmetic against theoretical values.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_epsilon_greedy_selection</code></td>
          <td>Ensures greedy exploitation strictly selects argmax Q(s, a) when ε = 0.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_training_improves_behaviour</code></td>
          <td>Validates that multi-episode background training expands Q-table state coverage.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
        <tr>
          <td><code>test_api_health & status</code></td>
          <td>Confirms FastAPI REST endpoints return HTTP 200 with typed JSON payloads.</td>
          <td style="color: #166534; font-weight: bold;">PASSED (100%)</td>
        </tr>
      </tbody>
    </table>

    <h2>9. Comparative Evaluation & Discussion</h2>
    <p>
      Compared to continuous Deep Reinforcement Learning (DQN / PPO), tabular Q-Learning is well-suited for discrete warehouse topologies (|S| = 72, |A| = 4). Tabular approaches guarantee asymptotic convergence without hyperparameter sensitivity or catastrophic forgetting, require negligible computational overhead (&lt; 10ms per episode), and allow exact inspection of Q-value tables for academic verification.
    </p>

    <h2>10. Conclusion & Future Directions</h2>
    <p>
      FlowPick demonstrates an end-to-end realization of reinforcement learning principles applied to autonomous warehouse fulfillment. By pairing rigorous Markov Decision Process formulation with multi-objective reward shaping, the agent reliably transitions from unguided exploration to optimal collision-free routing with 100% task completion. Future work will extend the framework to multi-agent cooperative pathfinding (MAPF) and dynamic obstacle avoidance.
    </p>

    <h2>References</h2>
    <p style="font-size: 9.5pt; line-height: 1.25; margin-bottom: 2pt;">
      [1] R. S. Sutton and A. G. Barto, <em>Reinforcement Learning: An Introduction</em>, 2nd ed. Cambridge, MA: MIT Press, 2018.<br>
      [2] C. J. Watkins and P. Dayan, "Q-learning," <em>Machine Learning</em>, vol. 8, no. 3, pp. 279–292, 1992.<br>
      [3] D. Silver et al., "Mastering the game of Go with deep neural networks and tree search," <em>Nature</em>, vol. 529, pp. 484–489, 2016.<br>
      [4] Z. R. Surani & V. Soni, "FlowPick: Adaptive Warehouse Learning Agent," <em>Task 2 Reinforcement Learning Assessment</em>, 2026.
    </p>
  </div>
  <div class="footer-rule">
    <span>Department of Computer Science & Engineering</span>
    <span>SRMIST — Academic RL Evaluation</span>
  </div>
</div>

</body>
</html>
"""

html_path = os.path.join(REPORT_DIR, "FlowPick_Academic_Report.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"Generated calibrated HTML report: {html_path}")

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
pdf_path = os.path.join(REPORT_DIR, "FlowPick_Academic_Report.pdf")
cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]
subprocess.run(cmd, capture_output=True, text=True)

with open(pdf_path, "rb") as f:
    data = f.read()
pages = re.findall(rb'/Type\s*/Page[^a-zA-Z]', data)
print(f"Generated PDF Page Count: {len(pages)}")
