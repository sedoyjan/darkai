const placeholders = [
  'Organize a company retreat',
  'Plan a surprise birthday party',
  'Develop a mobile application',
  'Launch a new marketing campaign',
  'Design a website for a client',
  'Prepare a business proposal',
  'Create an online course',
  'Set up a home office',
  'Build a custom PC',
  'Plan a wedding',
  'Conduct a user survey',
  'Host a webinar',
  'Run a social media campaign',
  'Prepare for a job interview',
  'Organize a charity event',
  'Plan a road trip',
  'Develop a new product prototype',
  'Write a novel',
  'Prepare a financial report',
];

export const getRandomPlaceholder = () => {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};
