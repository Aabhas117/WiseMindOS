import habitModel from '../models/habitModel.js';
import dailyPlanModel from '../models/dailyPlanModel.js';

// Helper function for streak logic
const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const compareDate = new Date(date);
    return yesterday.toISOString().split('T')[0] === compareDate.toISOString().split('T')[0];
};

const isToday = (date) => {
    const today = new Date().toISOString().split('T')[0];
    const compareDate = new Date(date).toISOString().split('T')[0];
    return today === compareDate;
};

// Create Habit
const createHabit = async (req, res) => {
    try {
        const { name, type, startTime, endTime, mode } = req.body;
        const userId = req.body.userId;

        if (!name) {
            return res.json({ success: false, message: 'Habit name is required' });
        }

        const newHabit = new habitModel({
            userId,
            name,
            type: type || 'daily',
            startTime: startTime || null,
            endTime: endTime || null,
            streak: 0,
            mode: mode || '21-day',
            lastCompleted: null
        });

        await newHabit.save();
        res.json({ success: true, habit: newHabit });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Habits
const getHabits = async (req, res) => {
    try {
        const userId = req.body.userId;
        const habits = await habitModel.find({ userId });
        res.json({ success: true, habits });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Habit
const updateHabit = async (req, res) => {
    try {
        const { habitId, name, type, startTime, endTime, mode } = req.body;
        const userId = req.body.userId;

        if (!habitId) {
            return res.json({ success: false, message: 'Habit ID is required' });
        }

        const habit = await habitModel.findOne({ _id: habitId, userId });
        if (!habit) {
            return res.json({ success: false, message: 'Habit not found' });
        }

        if (name) habit.name = name;
        if (type) habit.type = type;
        if (startTime !== undefined) habit.startTime = startTime;
        if (endTime !== undefined) habit.endTime = endTime;
        if (mode) habit.mode = mode;

        await habit.save();
        res.json({ success: true, habit });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Complete Habit (SSOT - Updates Habit with streak logic, then DailyPlan)
const completeHabit = async (req, res) => {
    try {
        const { habitId } = req.body;
        const userId = req.body.userId;

        if (!habitId) {
            return res.json({ success: false, message: 'Habit ID is required' });
        }

        // SOURCE OF TRUTH: Update Habit first
        const habit = await habitModel.findOne({ _id: habitId, userId });
        if (!habit) {
            return res.json({ success: false, message: 'Habit not found' });
        }

        // CRITICAL STREAK LOGIC
        if (habit.lastCompleted && isToday(habit.lastCompleted)) {
            // Already completed today - do nothing
            return res.json({ success: true, habit, message: 'Already completed today' });
        }

        if (habit.lastCompleted && isYesterday(habit.lastCompleted)) {
            // Completed yesterday - increment streak
            habit.streak += 1;
        } else {
            // Streak broken or first time - reset to 1
            habit.streak = 1;
        }

        habit.lastCompleted = new Date();
        await habit.save();

        // SYNC: Update in DailyPlan if exists
        const today = new Date().toISOString().split('T')[0];
        const dailyPlan = await dailyPlanModel.findOne({ userId, date: today });
        
        if (dailyPlan) {
            const plannedHabit = dailyPlan.plannedTasks.find(pt => 
                pt.source === 'habit' && pt.habitId && pt.habitId.toString() === habitId
            );
            
            if (plannedHabit) {
                plannedHabit.completed = true;
                await dailyPlan.save();
            }
        }

        res.json({ success: true, habit });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Habit
const deleteHabit = async (req, res) => {
    try {
        const { habitId } = req.body;
        const userId = req.body.userId;

        if (!habitId) {
            return res.json({ success: false, message: 'Habit ID is required' });
        }

        const habit = await habitModel.findOneAndDelete({ _id: habitId, userId });
        if (!habit) {
            return res.json({ success: false, message: 'Habit not found' });
        }

        // Remove from DailyPlan if exists
        await dailyPlanModel.updateMany(
            { userId },
            { $pull: { plannedTasks: { habitId: habitId } } }
        );

        res.json({ success: true, message: 'Habit deleted successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createHabit, getHabits, updateHabit, completeHabit, deleteHabit };