# 4-Day Execution Roadmap (Oct 28 - Oct 31)

## Day 1: Infrastructure & Plumbing (Oct 28)
- [ ] Create public GitHub repo with MIT License.
- [ ] Initialize Python FastAPI backend and React frontend.
- [ ] Create PayPal Developer Account & generate Sandbox credentials.
- [ ] Set up ngrok (or Render) for local webhook testing.
- [ ] Implement `POST /webhook` to successfully catch `CUSTOMER.DISPUTE.CREATED`.

## Day 2: AI & Data Engineering (Oct 29)
- [ ] Set up local or cloud Elastic instance.
- [ ] Seed Elastic with 3-5 mock transaction records (shipping details, chat logs).
- [ ] Write the Python function to query Elastic by `transaction_id`.
- [ ] Write the LLM Prompt system. Implement the API call to OpenAI/Claude.
- [ ] Test the pipeline: Webhook -> Elastic -> LLM -> JSON Output.

## Day 3: PayPal Submission & UI (Oct 30)
- [ ] Implement PayPal authentication (OAuth2 token generation).
- [ ] Implement `POST /v1/customer/disputes/{id}/provide-evidence`.
- [ ] Build the React frontend with AG Grid.
- [ ] Connect the frontend to the backend to display the database of processed disputes.
- [ ] Verify end-to-end sandbox flow.

## Day 4: Submission Polish (Oct 31)
- [ ] Write the Devpost submission text (Problem, Solution, Tech Stack).
- [ ] Polish the `README.md` with foolproof setup instructions.
- [ ] Record the 3-minute YouTube demo.
    *   *0:00-0:45*: Intro & Problem statement.
    *   *0:45-2:15*: Live Demo (Open dispute in Sandbox -> watch dashboard update -> view AI evidence).
    *   *2:15-3:00*: Architecture & conclusion.
- [ ] Submit before the deadline.