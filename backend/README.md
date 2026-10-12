# FlowPick Backend — Adaptive Warehouse Learning Agent

This is the FastAPI Reinforcement Learning backend for **FlowPick (Task 2: Fundamentals of Reinforcement Learning)**.
It executes an actual tabular **Q-Learning** algorithm that trains an autonomous mobile agent to navigate a simplified warehouse environment, pick up an inventory item, and transport it to the dispatch dock while avoiding storage rack obstacles and minimizing step penalties.

---

## 1. Reinforcement Learning Formulation

- **Agent**: Autonomous warehouse picking robot (AGV).
- **Environment**: 2D discrete warehouse grid ($6 \times 6$) with static storage racks (shelves), pickup station, and dispatch dock.
- **State Space ($S$)**: Discrete tuple `(agent_row, agent_col, has_package)`.
- **Action Space ($A$)**: Discrete transitions `[UP, DOWN, LEFT, RIGHT]`.
- **Reward Function ($R$)**:
  - `+100`: Successful delivery (package brought to dispatch zone).
  - `-1`: Movement step cost (promotes shortest path policy).
  - `-10`: Invalid / obstacle collision (hitting wall boundary or shelf).
  - `-5`: Unnecessary / delayed movement (looping or excessive steps).
  - `+20`: Interim pickup milestone reward.

---

## 2. Q-Learning Algorithm

Model-free off-policy Temporal Difference control updating action-values $Q(s, a)$ via the Bellman Optimality equation:

$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$

For terminal states:
$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r - Q(s, a) \right]$$

- $\alpha$ (Learning Rate): Controls magnitude of Q-value adjustments from TD error.
- $\gamma$ (Discount Factor): Weights immediate rewards versus expected future cumulative rewards.
- $\epsilon$ (Exploration Rate): Probability of taking random exploratory action ($\epsilon$-greedy policy with decay).

---

## 3. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status (`{"status": "ok"}`) |
| `GET` | `/api/environment` | Grid dimensions, shelves, target, dispatch, and current path |
| `GET` | `/api/agent` | Real-time agent coordinates, action, step reward, and cumulative return |
| `GET` | `/api/training/status` | Central training state, convergence statistics, and episode history |
| `POST` | `/api/training/start` | Launch asynchronous Q-Learning training loop in background thread |
| `POST` | `/api/training/pause` | Safely pause active training loop |
| `POST` | `/api/training/reset` | Reset environment, metrics history, and Q-table |
| `POST` | `/api/episode/reset` | Reset only current warehouse episode position |
| `POST` | `/api/agent/step` | Trigger single environment step via learned policy |
| `POST` | `/api/evaluation/run` | Execute greedy evaluation episode ($\epsilon = 0$) using learned policy |
| `GET` | `/api/metrics` | Return completed training episode rewards and success rates |

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

## 4. Installation & Local Setup

### Prerequisites
- Python 3.11+

### Run Backend
```bash
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Run Tests
```bash
cd backend
.venv\Scripts\pytest -v
```

---

## 5. Demo & Evaluation Workflow

1. Start backend on `http://localhost:8000`.
2. Start frontend on `http://localhost:5173`.
3. Open **Live Agent** in the frontend to observe the warehouse environment.
4. Open **Training** tab, adjust hyperparameters ($\alpha$, $\gamma$, $\epsilon$, episodes), and click **Start Training**.
5. Switch to **Live Agent** to visually watch the agent interact with the environment in real time as the Q-table updates.
6. Check the **Learning Curve** chart in the Training tab to observe empirical reward improvement and success rate convergence.
7. Click **Run Evaluation** to run a purely greedy episode ($\epsilon = 0$) demonstrating the optimal learned path from start to pickup to dispatch.
