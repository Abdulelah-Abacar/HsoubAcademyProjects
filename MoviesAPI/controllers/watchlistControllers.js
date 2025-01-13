const User = require('../models/User')

exports.addToWatchList = async (req, res) => {
  const { movie, watchState } = req.body
  const user = await User.findById(req.userId)
  const index = user.watchList.findIndex(item => item.movie == movie)

  if (index > -1) {
    user.watchList[index].watchState = watchState
  } else { 
    user.watchList.push({ movie, watchState })
  }
  await user.save()

  res.json({
    success: true,
    data: {movie, watchState}
  })
}

exports.deleteFromList = async (req, res) => {
  const { movie } = req.params
  const user = await User.findById(req.userId)
  user.watchList = user.watchList.filter(e => e.movie != movie)
  await user.save()
  res.json({
    success: true
  })
}

exports.getWatchList = async (req, res) => {
  const user = await User.findById(req.userId).select('-watchList._id')
    .populate('watchList.movie', ['name', 'category'])
  res.json({
    success: true,
    data: user.watchList
  })
}