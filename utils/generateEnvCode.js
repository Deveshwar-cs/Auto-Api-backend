export const generateEnvCode = (project) => {
  return `
PORT=${project.port}
MONGO_URI=${project.mongoUri}
JWT_SECRET=${project.jwtSecret}
`;
};
