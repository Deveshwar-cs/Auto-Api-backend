import Project from "../models/Project.js";
import Collection from "../models/Collection.js";
import {asyncHandler} from "../middleware/asyncHandler.js";

export const getOverviewStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({userId});

  const projectIds = projects.map((p) => p._id);

  const collections = await Collection.find({
    projectId: {$in: projectIds},
  });

  const projectCount = projects.length;
  const collectionCount = collections.length;

  let totalApis = collectionCount * 5;

  projects.forEach((project) => {
    if (project.enableAuth) {
      totalApis += 2;
    }
  });

  // newest projects
  const recentProjects = await Project.find({userId})
    .sort({createdAt: -1})
    .limit(5)
    .select("projectName createdAt");

  res.json({
    totalProjects: projectCount,
    totalCollections: collectionCount,
    totalApis,
    recentProjects,
  });
});
