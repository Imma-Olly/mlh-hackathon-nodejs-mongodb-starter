exports.getGithub = async (req, res, next) => {
    const github = new Octokit();
    try {
      const { data: repo } = await github.repos.get({ owner: 'mlh', repo: 'mlh-hackathon-nodejs-mongodb-starter'});
      res.render('api/github', {
        title: 'GitHub API',
        repo
      });
    } catch (error) {
      next(error);
    }
  };