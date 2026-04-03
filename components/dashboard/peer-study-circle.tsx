'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Plus, Clock, Zap, MessageCircle, DoorOpen, Trophy, Medal, Crown, TrendingUp, Flame } from 'lucide-react'
import { useDashboardStore, type StudyRoom, type StudyPeer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Fake leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Arjun K.', avatar: 'AK', score: 2850, streak: 14, hoursThisWeek: 32, trend: 'up', badge: 'gold' },
  { rank: 2, name: 'Priya S.', avatar: 'PS', score: 2720, streak: 11, hoursThisWeek: 28, trend: 'up', badge: 'silver' },
  { rank: 3, name: 'Rahul M.', avatar: 'RM', score: 2680, streak: 9, hoursThisWeek: 26, trend: 'same', badge: 'bronze' },
  { rank: 4, name: 'You', avatar: 'ME', score: 2450, streak: 7, hoursThisWeek: 22, trend: 'up', badge: null, isCurrentUser: true },
  { rank: 5, name: 'Sneha V.', avatar: 'SV', score: 2380, streak: 6, hoursThisWeek: 20, trend: 'down', badge: null },
  { rank: 6, name: 'Vikram R.', avatar: 'VR', score: 2290, streak: 5, hoursThisWeek: 18, trend: 'up', badge: null },
  { rank: 7, name: 'Anita P.', avatar: 'AP', score: 2150, streak: 4, hoursThisWeek: 16, trend: 'same', badge: null },
  { rank: 8, name: 'Karthik D.', avatar: 'KD', score: 2080, streak: 3, hoursThisWeek: 14, trend: 'down', badge: null },
]

const badgeColors = {
  gold: 'from-yellow-400 to-amber-500',
  silver: 'from-slate-300 to-slate-400',
  bronze: 'from-orange-400 to-orange-600',
}

const badgeIcons = {
  gold: Crown,
  silver: Medal,
  bronze: Medal,
}

function LeaderboardEntry({ entry, index }: { entry: typeof leaderboardData[0]; index: number }) {
  const BadgeIcon = entry.badge ? badgeIcons[entry.badge as keyof typeof badgeIcons] : null
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        flex items-center gap-3 p-3 rounded-xl transition-all
        ${entry.isCurrentUser 
          ? 'bg-primary/20 border border-primary/30 ring-2 ring-primary/20' 
          : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
        }
      `}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        {entry.badge ? (
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${badgeColors[entry.badge as keyof typeof badgeColors]} flex items-center justify-center shadow-lg`}>
            {BadgeIcon && <BadgeIcon className="w-4 h-4 text-white" />}
          </div>
        ) : (
          <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white
        ${entry.isCurrentUser 
          ? 'bg-gradient-to-br from-primary to-accent ring-2 ring-primary/50' 
          : 'bg-gradient-to-br from-slate-500 to-slate-600'
        }
      `}>
        {entry.avatar}
      </div>

      {/* Name & Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm truncate ${entry.isCurrentUser ? 'text-primary' : 'text-card-foreground'}`}>
            {entry.name}
          </span>
          {entry.isCurrentUser && (
            <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
              You
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {entry.streak} day streak
          </span>
          <span>{entry.hoursThisWeek}h this week</span>
        </div>
      </div>

      {/* Score & Trend */}
      <div className="text-right">
        <div className="font-bold text-card-foreground">{entry.score.toLocaleString()}</div>
        <div className={`flex items-center justify-end gap-1 text-xs ${
          entry.trend === 'up' ? 'text-green-500' : 
          entry.trend === 'down' ? 'text-red-500' : 
          'text-muted-foreground'
        }`}>
          {entry.trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {entry.trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
          <span>pts</span>
        </div>
      </div>
    </motion.div>
  )
}

function Leaderboard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Weekly Leaderboard
        </h3>
        <Badge variant="outline" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Resets in 3d 14h
        </Badge>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-2 py-4 bg-gradient-to-b from-muted/50 to-transparent rounded-xl">
        {/* Second Place */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-xs font-bold text-white mb-2 shadow-lg">
            {leaderboardData[1].avatar}
          </div>
          <div className="text-xs font-medium text-card-foreground">{leaderboardData[1].name}</div>
          <div className="text-xs text-muted-foreground">{leaderboardData[1].score}</div>
          <div className="w-14 h-16 bg-gradient-to-t from-slate-400 to-slate-300 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-white font-bold text-lg">2</span>
          </div>
        </motion.div>

        {/* First Place */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center -mt-4"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-6 h-6 text-yellow-500 mb-1" />
          </motion.div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-sm font-bold text-white mb-2 shadow-lg ring-2 ring-yellow-300/50">
            {leaderboardData[0].avatar}
          </div>
          <div className="text-sm font-semibold text-card-foreground">{leaderboardData[0].name}</div>
          <div className="text-xs text-muted-foreground">{leaderboardData[0].score}</div>
          <div className="w-16 h-20 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-white font-bold text-xl">1</span>
          </div>
        </motion.div>

        {/* Third Place */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white mb-2 shadow-lg">
            {leaderboardData[2].avatar}
          </div>
          <div className="text-xs font-medium text-card-foreground">{leaderboardData[2].name}</div>
          <div className="text-xs text-muted-foreground">{leaderboardData[2].score}</div>
          <div className="w-14 h-12 bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-white font-bold text-lg">3</span>
          </div>
        </motion.div>
      </div>

      {/* Full leaderboard list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {leaderboardData.slice(3).map((entry, index) => (
          <LeaderboardEntry key={entry.rank} entry={entry} index={index} />
        ))}
      </div>

      {/* Your stats summary */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">Your Position</p>
            <p className="text-xs text-muted-foreground">Keep pushing to reach top 3!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">#4</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2 from last week
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const statusColors = {
  studying: 'bg-green-500',
  available: 'bg-yellow-500',
  away: 'bg-gray-500'
}

const statusLabels = {
  studying: 'Studying',
  available: 'Available',
  away: 'Away'
}

function StatusBadge({ status }: { status: StudyPeer['status'] }) {
  return (
    <div className={`${statusColors[status]} w-3 h-3 rounded-full`} />
  )
}

function PeerAvatar({ peer }: { peer: StudyPeer }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative"
      title={`${peer.name} - ${statusLabels[peer.status]} (${peer.timeOnline}min)`}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
        {peer.avatar}
      </div>
      <div className={`absolute bottom-0 right-0 ${statusColors[peer.status]} w-3 h-3 rounded-full border border-card`} />
    </motion.div>
  )
}

function StudyRoomCard({ room, isActive, onJoin, onLeave }: {
  room: StudyRoom
  isActive: boolean
  onJoin: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-card-foreground">{room.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{room.topic}</p>
        </div>
        {room.pomodoroActive && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/20 text-destructive text-xs font-medium"
          >
            <Zap className="w-3 h-3" />
            {room.focusTime}min
          </motion.div>
        )}
      </div>

      {/* Peer Avatars */}
      <div className="flex gap-2 mb-3">
        {room.peers.map(peer => (
          <PeerAvatar key={peer.id} peer={peer} />
        ))}
        <div className="text-xs text-muted-foreground flex items-center mt-0.5">
          {room.peers.length} online
        </div>
      </div>

      {/* Action */}
      {isActive ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onLeave}
          className="w-full"
        >
          <DoorOpen className="w-3 h-3 mr-1" />
          Leave Room
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onJoin}
          className="w-full"
        >
          <Users className="w-3 h-3 mr-1" />
          Join Study Room
        </Button>
      )}
    </motion.div>
  )
}

export function PeerStudyCircle() {
  const {
    isPeerStudyOpen,
    togglePeerStudy,
    studyRooms,
    activeStudyRoomId,
    joinStudyRoom,
    leaveStudyRoom,
    onlinePeers
  } = useDashboardStore()

  const activeRoom = studyRooms.find(r => r.id === activeStudyRoomId)

  return (
    <AnimatePresence>
      {isPeerStudyOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="border-b border-border p-6 flex items-center justify-between sticky top-0 bg-card">
              <div>
                <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Peer Study Circle
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Join study rooms and collaborate with classmates
                </p>
              </div>
              <button
                onClick={togglePeerStudy}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Leaderboard */}
              <Leaderboard />

              {/* Online Peers */}
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Online Right Now ({onlinePeers.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {onlinePeers.map(peer => (
                    <motion.div
                      key={peer.id}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all cursor-pointer text-center group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white mx-auto mb-2 group-hover:scale-110 transition-transform">
                        {peer.avatar}
                      </div>
                      <p className="text-xs font-medium text-card-foreground">{peer.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{peer.topic}</p>
                      <div className="flex items-center gap-1 justify-center mt-2">
                        <StatusBadge status={peer.status} />
                        <span className="text-xs text-muted-foreground">{statusLabels[peer.status]}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Study Rooms */}
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Active Study Rooms
                </h3>
                <div className="grid gap-4">
                  {studyRooms.map(room => (
                    <StudyRoomCard
                      key={room.id}
                      room={room}
                      isActive={activeStudyRoomId === room.id}
                      onJoin={() => joinStudyRoom(room.id)}
                      onLeave={leaveStudyRoom}
                    />
                  ))}
                </div>
              </div>

              {/* Active Room Details */}
              {activeRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-3"
                >
                  <p className="text-sm font-medium text-primary">
                    ✓ You&apos;re now in {activeRoom.name}
                  </p>
                  
                  {/* Pomodoro Timer */}
                  {activeRoom.pomodoroActive && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Focus Time</span>
                          <span className="font-semibold text-card-foreground">{activeRoom.focusTime}:00</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '30%' }}
                            transition={{ duration: 60, ease: 'linear' }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Room Peers */}
                  <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Room Participants</p>
                    <div className="flex gap-2 flex-wrap">
                      {activeRoom.peers.map(peer => (
                        <div
                          key={peer.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border text-xs"
                        >
                          <PeerAvatar peer={peer} />
                          <span className="text-card-foreground">{peer.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recommended Actions */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                <p className="text-sm font-medium text-card-foreground mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Create Room
                  </Button>
                  <Button variant="outline" size="sm">
                    <Zap className="w-3 h-3 mr-1" />
                    Start Pomodoro
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Room Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-3 h-3 mr-1" />
                    Ask for Help
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
