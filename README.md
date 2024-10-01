Steps to run application
docker-compose up --build


Enhancements:

1) Separation of Concerns in Frontend:

Current Issue: The frontend currently handles two processes in a single action (handleAnswer), which submits an answer and emits an event to the socket. This approach is problematic because the RabbitMQ queue might not be processed before the event is emitted.

Proposed Solution: The real-time service should be integrated with RabbitMQ. A new queue named score_updated should be added. The workflow will change as follows:

. The Score service will act as both a Consumer (for the score_updates queue with the Quiz service) and a Producer (for the score_updated queue with the Real-time service).

. The Real-time service will be a Consumer of the score_updated queue. Once it consumes the data from the Score service, it will collect leaderboard data from the User service, Quiz service, and Score service. After gathering the data, it will broadcast a message back to the client to re-render the leaderboard.