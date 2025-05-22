const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Team = require("../models/Team");


// Verify/Unverify team
router.put("/teams/:teamId/verify", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { isVerified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID format"
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Update team verification status
    team.isVerified = isVerified;
    await team.save();

    res.status(200).json({
      success: true,
      message: `Team ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: team
    });
  } catch (error) {
    console.error("Error updating team verification:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update team verification status"
    });
  }
});

// Delete player from team
router.delete("/teams/:teamId/players/:playerId", async (req, res) => {
  try {
    const { teamId, playerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team or player ID format"
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Find player index
    const playerIndex = team.players.findIndex(p => p._id.toString() === playerId);
    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Player not found in team"
      });
    }

    // Remove player from array
    team.players.splice(playerIndex, 1);
    await team.save();

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
      data: team
    });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete player"
    });
  }
});

// Add goals to player
router.post("/teams/:teamId/players/:playerId/goals", async (req, res) => {
  try {
    const { teamId, playerId } = req.params;


    const { goals } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team or player ID format"
      });
    }

    if (!goals || isNaN(goals) || goals < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid goals value"
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Find player
    const player = team.players.find(p => p._id.toString() === playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found in team"
      });
    }

    // Update player goals
    player.goals = (player.goals || 0) + parseInt(goals);
    await team.save();

    res.status(200).json({
      success: true,
      message: "Goals added successfully",
      data: player
    });
  } catch (error) {
    console.error("Error adding goals:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add goals"
    });
  }
});

// Delete team
router.delete("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID format"
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Delete the team
    await Team.findByIdAndDelete(teamId);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete team"
    });
  }
});

module.exports = router; 