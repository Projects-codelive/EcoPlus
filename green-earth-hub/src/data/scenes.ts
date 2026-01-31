import { Scene } from '../types/game';

export const scenes: Record<string, Scene> = {
  start: {
    id: 'start',
    background: 'apartment',
    characters: [],
    music: 'calm',
    weather: 'clear',
    dialogue: [
      { speaker: 'System', text: 'The year is 2028. The coastal city of Neovara balances on the edge of progress and collapse.' },
      { speaker: 'System', text: 'Your choices today will ripple through the air, the water, and the lives of everyone around you.' },
      { speaker: 'You', text: 'Another morning. The news alert on my phone is blinking red.' }
    ],
    choices: [
      {
        id: 'check_news',
        text: 'Check the flood warning alert',
        nextSceneId: 'commute_morning',
        impact: { awareness: 10, fear: 5 },
        reactionText: 'Flood risk: High. High tide coincides with the storm surge tonight.'
      },
      {
        id: 'ignore_news',
        text: 'Swipe it away. Too stressful.',
        nextSceneId: 'commute_morning',
        impact: { awareness: -5, hope: 5 },
        reactionText: 'Better to focus on the day ahead. Worrying won\'t stop the rain.'
      },
      {
        id: 'share_news',
        text: 'Forward to the group chat',
        nextSceneId: 'commute_morning',
        impact: { awareness: 5, action: 5, empathy: 5 },
        reactionText: 'Sent. "Guys, be careful tonight. Looks bad."'
      }
    ]
  },
  commute_morning: {
    id: 'commute_morning',
    background: 'city_morning',
    characters: [
      { id: 'Aarav', expression: 'worried', position: 'right' }
    ],
    music: 'calm',
    weather: 'smog',
    dialogue: [
      { speaker: 'Aarav', text: 'Did you see the sky? It\'s that weird yellow-grey again.', expression: 'worried' },
      { speaker: 'Aarav', text: 'My asthma is already acting up and I haven\'t even reached the station.', expression: 'frustrated' }
    ],
    choices: [
      {
        id: 'carpool',
        text: 'Offer to share a cab (Comfort)',
        nextSceneId: 'office_arrival',
        impact: { airQuality: -5, empathy: 5, impact: -5 },
        reactionText: 'Aarav sighs in relief. "Thanks. I couldn\'t handle the walk today."'
      },
      {
        id: 'bus',
        text: 'Take the electric bus together (Sustainable)',
        nextSceneId: 'office_arrival',
        impact: { airQuality: 5, action: 5, impact: 5 },
        reactionText: 'It\'s crowded, but the air inside is filtered. Aarav nods appreciatively.'
      },
      {
        id: 'walk',
        text: 'Suggest walking with masks (Health risk)',
        nextSceneId: 'office_arrival',
        impact: { airQuality: 10, fear: 10, impact: 10 },
        reactionText: 'The smog stings your eyes, but you save the emissions. Aarav coughs.'
      }
    ]
  },
  office_arrival: {
    id: 'office_arrival',
    background: 'city_morning',
    characters: [
      { id: 'Maya', expression: 'happy', position: 'left' },
      { id: 'Aarav', expression: 'neutral', position: 'right' }
    ],
    music: 'calm',
    weather: 'clear',
    dialogue: [
      { speaker: 'Maya', text: 'Hey! You made it. Look at this!', expression: 'happy' },
      { speaker: 'Maya', text: 'I found this amazing sale online. 5 shirts for the price of 1!', expression: 'determined' },
      { speaker: 'Aarav', text: 'Maya, you know those end up in a landfill in six months, right?', expression: 'worried' }
    ],
    choices: [
      {
        id: 'support_maya',
        text: 'That\'s a steal! Send me the link.',
        nextSceneId: 'lunch_break',
        impact: { impact: -10, empathy: 5, biodiversity: -5 },
        reactionText: 'Maya beams. "Right? Who cares if it\'s last season?"'
      },
      {
        id: 'educate_gentle',
        text: 'Maybe check the fabric? Synthetics shed microplastics.',
        nextSceneId: 'lunch_break',
        impact: { awareness: 10, action: 5 },
        reactionText: 'Maya frowns, checking the tag. "100% Polyester. Ugh."'
      },
      {
        id: 'scold',
        text: 'Fast fashion is killing the planet, Maya.',
        nextSceneId: 'lunch_break',
        impact: { awareness: 5, empathy: -10, fear: 5 },
        reactionText: 'The mood drops. Maya puts her phone away silently.'
      }
    ]
  },
  lunch_break: {
    id: 'lunch_break',
    background: 'community_center',
    characters: [
      { id: 'Aarav', expression: 'neutral', position: 'center' }
    ],
    music: 'calm',
    weather: 'clear',
    dialogue: [
      { speaker: 'Aarav', text: 'I\'m starving. The usual place?', expression: 'neutral' },
      { speaker: 'System', text: 'The usual place serves everything in styrofoam. But it\'s cheap and fast.' }
    ],
    choices: [
      {
        id: 'styrofoam',
        text: 'Yeah, let\'s go. I\'m in a rush.',
        nextSceneId: 'flood_alert',
        impact: { impact: -5, biodiversity: -5 },
        reactionText: 'The food is hot, but the mountain of white trash in the bin makes you wince.'
      },
      {
        id: 'bring_container',
        text: 'I brought my own container. Let\'s go there.',
        nextSceneId: 'flood_alert',
        impact: { action: 10, impact: 5 },
        reactionText: 'The server looks surprised but fills your glass bowl. "Wish more people did that."'
      },
      {
        id: 'vegan_place',
        text: 'Let\'s try that new plant-based spot instead.',
        nextSceneId: 'flood_alert',
        impact: { impact: 10, biodiversity: 5, empathy: 5 },
        reactionText: 'It\'s more expensive, but the food feels cleaner. Aarav looks relieved.'
      }
    ]
  },
  flood_alert: {
    id: 'flood_alert',
    background: 'flood_warning',
    characters: [],
    music: 'tension',
    weather: 'storm',
    dialogue: [
      { speaker: 'System', text: 'The sky turns a bruised purple. Thunder rattles the windows.' },
      { speaker: 'System', text: 'EMERGENCY ALERT: FLASH FLOOD WARNING. SEEK HIGHER GROUND.' },
      { speaker: 'You', text: 'It wasn\'t supposed to hit until tonight.' }
    ],
    choices: [
      {
        id: 'rush_home',
        text: 'Rush home immediately to save your things.',
        nextSceneId: 'storm_hits',
        impact: { fear: 10, empathy: -5 },
        reactionText: 'You sprint for the door, heart pounding.'
      },
      {
        id: 'help_office',
        text: 'Stay and help sandbag the office entrance.',
        nextSceneId: 'storm_hits',
        impact: { action: 10, empathy: 10, empowerment: 5 },
        reactionText: 'You grab a shovel. Aarav joins you.'
      },
      {
        id: 'check_community',
        text: 'Call the elderly neighbor to check on them.',
        nextSceneId: 'storm_hits',
        impact: { empathy: 15, action: 5 },
        reactionText: 'She answers, terrified. You promise to come get her.'
      }
    ]
  },
  storm_hits: {
    id: 'storm_hits',
    background: 'city_smog', // Placeholder for storm visual
    characters: [
      { id: 'Aarav', expression: 'worried', position: 'left' },
      { id: 'Maya', expression: 'worried', position: 'right' }
    ],
    music: 'crisis',
    weather: 'storm',
    dialogue: [
      { speaker: 'Maya', text: 'The water is rising so fast. I\'ve never seen it like this.', expression: 'worried' },
      { speaker: 'Aarav', text: 'The drainage systems are clogged with trash. The water has nowhere to go.', expression: 'angry' }
    ],
    choices: [
      {
        id: 'blame',
        text: 'If the city had cleaned the drains, we\'d be fine.',
        nextSceneId: 'aftermath',
        impact: { fear: 5, action: -5 },
        reactionText: 'True, but blaming them now doesn\'t stop the water.'
      },
      {
        id: 'act_local',
        text: 'Let\'s clear the grate on the corner. Now.',
        nextSceneId: 'aftermath',
        impact: { action: 15, empowerment: 10, waterLevel: -5 },
        reactionText: 'You wade into the cold muck. Pulling the debris free, a whirlpool forms.'
      },
      {
        id: 'document',
        text: 'Film it. People need to see this reality.',
        nextSceneId: 'aftermath',
        impact: { awareness: 15, impact: 5 },
        reactionText: 'You stream the rising water. Views skyrocket. "This is our reality."'
      }
    ]
  },
  aftermath: {
    id: 'aftermath',
    background: 'park_withered',
    characters: [],
    music: 'calm',
    weather: 'rain',
    dialogue: [
      { speaker: 'System', text: 'The water recedes, leaving a layer of silt and plastic.' },
      { speaker: 'System', text: 'The city breathes a wet, heavy sigh.' }
    ],
    choices: [
      {
        id: 'volunteer',
        text: 'Sign up for the weekend cleanup crew.',
        nextSceneId: 'town_hall',
        impact: { action: 10, empathy: 5, biodiversity: 5 },
        reactionText: 'You put your name down. It feels like a start.'
      },
      {
        id: 'donate',
        text: 'Donate to the relief fund.',
        nextSceneId: 'town_hall',
        impact: { impact: 5, empathy: 5 },
        reactionText: 'Money helps. But the problem remains.'
      },
      {
        id: 'rest',
        text: 'Go home and sleep. It\'s too much.',
        nextSceneId: 'town_hall',
        impact: { fear: 5, empowerment: -5 },
        reactionText: 'You close the blinds. The world is too heavy today.'
      }
    ]
  },
  town_hall: {
    id: 'town_hall',
    background: 'community_center',
    characters: [
      { id: 'Maya', expression: 'determined', position: 'center' }
    ],
    music: 'hope',
    weather: 'clear',
    dialogue: [
      { speaker: 'Maya', text: 'They\'re voting on the new "Green Lung" park project today.', expression: 'determined' },
      { speaker: 'Maya', text: 'Developers want to turn that lot into a parking garage instead.', expression: 'frustrated' }
    ],
    choices: [
      {
        id: 'speak_up',
        text: 'Take the mic and speak for the park.',
        nextSceneId: 'ending',
        impact: { action: 20, empowerment: 15, biodiversity: 10 },
        reactionText: 'Your voice shakes, but the room goes quiet to listen.'
      },
      {
        id: 'vote_quietly',
        text: 'Cast your vote for the park and leave.',
        nextSceneId: 'ending',
        impact: { action: 5, impact: 5 },
        reactionText: 'Every vote counts. You hope it\'s enough.'
      },
      {
        id: 'skeptical',
        text: 'A park won\'t fix the flooding. We need dams.',
        nextSceneId: 'ending',
        impact: { awareness: 5, biodiversity: -5 },
        reactionText: 'Maya looks disappointed. "It\'s about absorption, not just barriers."'
      }
    ]
  },
  ending: {
    id: 'ending',
    background: 'city_morning',
    characters: [],
    music: 'hope',
    weather: 'clear',
    dialogue: [
      { speaker: 'System', text: 'Time passes. The choices of one person ripple out.' },
      { speaker: 'System', text: 'Calculating your impact...' }
    ],
    choices: [] // Empty choices triggers the end screen
  }
};
