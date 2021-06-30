async function createRef(octokit, owner, repo, ref, sha) {
  console.log(`owner=${ owner }, repo=${ repo }, ref=${ ref }, sha=${ sha }`);
  const response = await octokit.rest.git.createRef({
    owner: owner,
    repo: repo,
    ref: ref,
    sha: sha,
  });
  console.log(`response=${ JSON.stringify(response) }`);
}

async function createTag(octokit, owner, repo, tag, message, object, type) {
  const response = await octokit.rest.git.createTag({
    owner: owner,
    repo: repo,
    tag: tag,
    message: message,
    object: object,
    type: type
  });

  return response.status;
}

async function deleteRef(octokit, owner, repo, ref) {
  console.log(`owner=${ owner }, repo=${ repo }, ref=${ ref }`);

  const response = await octokit.rest.git.deleteRef({
    owner: owner,
    repo: repo,
    ref: ref
  });
  console.log(`response=${ JSON.stringify(response) }`);
}

async function deleteSliceOfTags(octokit, owner, repo, from, to, tags = null) {
  console.log(`owner=${ owner }, repo=${ repo }, from=${ from }, to=${ to }`);
  console.log(`tags=${ JSON.stringify(tags) }`);

  if (tags == null) {
    tags = await getTags(octokit, owner, repo);
    console.log(`tags=${ JSON.stringify(tags) }`);
  }

  for (const tag of tags.slice(from, to)) {
    console.log(`tag.name=${ tag.name }`);
    await deleteRef(octokit, owner, repo, `tags/${ tag.name }`);
  }
}

async function deleteTags(octokit, owner, repo, tags = null) {
  console.log(`owner=${ owner }, repo=${ repo }, tags=${ tags }`);

  if (tags == null) {
    tags = await getTags(octokit, owner, repo);
    console.log(`tags=${ JSON.stringify(tags) }`);
  }

  if (tags != null) {
    for (const tag of tags) {
      console.log(`tag.name=${ tag.name }`);
      await deleteRef(octokit, owner, repo, `tags/${ tag.name }`);
    }
  }
}

async function getBranch(octokit, owner, repo, branch) {
  console.log(`owner=${ owner }, repo=${ repo }, branch=${ branch }`);
  var result_branch = null;

  const response = await octokit.rest.repos.getBranch({
    owner: owner,
    repo: repo,
    branch: branch
  })
  console.log(`response=${ JSON.stringify(response) }`);
  console.log(`response.status=${ JSON.stringify(response.status) }`);
  
  if (response.status == 200) {
    console.log(`if`);
    result_branch = response.data;
    console.log(`response.data=${ JSON.stringify(response.data) }`);

  }
  console.log(`resulst_branch=${ JSON.stringify(result_branch) }`);
  return result_branch;
}

async function getCommit(octokit, owner, repo, commit_sha) {
  console.log(`owner=${ owner }, repo=${ repo }, commit_sha=${ commit_sha }`);

  var commit = null;
  
  const response = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    commit = response.data;
  }

  console.log(`tags=${ JSON.stringify(commit, null, 2) }`);
  return commit;
}

async function getPullRequest(octokit, owner, repo, pull_number) {
  console.log(`owner=${ owner }, repo=${ repo }, pull_number=${ pull_number }`);

  var pull_request = null;
  
  const response = await octokit.rest.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: pull_number
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    pull_request = response.data;
  }

  console.log(`pull_request=${ JSON.stringify(pull_request, null, 2) }`);
  return pull_request;
}

async function getPullsList(octokit, owner, repo) {
  console.log(`owner=${ owner }, repo=${ repo }`);

  var list_pull_requests = null;
  
  const response = await octokit.rest.pulls.list({
    owner,
    repo
  });
  
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_pull_requests = response.data;
  }

  console.log(`list_pull_requests=${ JSON.stringify(list_pull_requests, null, 2) }`);
  return list_pull_requests;
}

async function getTags(octokit, owner, repo) {
  console.log(`owner=${ owner }, repo=${ repo }`);

  var tags = null;
  
  const response = await octokit.rest.repos.listTags({
    owner: owner,
    repo: repo
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    tags = response.data;
  }

  console.log(`tags=${ JSON.stringify(tags) }`);
  return tags;
}

async function listComments(octokit, owner, repo, issue_number) {
  console.log(`owner=${ owner }, repo=${ repo }, issue_number=${ issue_number }`);

  var list_comments = null;
  
  const response = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number
  });  
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_comments = response.data;
  }

  console.log(`list_comments=${ JSON.stringify(list_comments, null, 2) }`);
  return list_comments;
}

async function listCommentsForCommit(octokit, owner, repo, commit_sha) {
  console.log(`owner=${ owner }, repo=${ repo }, commit_sha=${ commit_sha }`);

  var list_comments_for_commit = null;
  
  const response = await octokit.rest.repos.listCommentsForCommit({
    owner,
    repo,
    commit_sha
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_comments_for_commit = response.data;
  }

  console.log(`list_comments_for_commit=${ JSON.stringify(list_comments_for_commit, null, 2) }`);
  return list_comments_for_commit;
}

async function listPullRequestsAssociatedWithCommit(octokit, owner, repo, commit_sha) {
  console.log(`owner=${ owner }, repo=${ repo }, commit_sha=${ commit_sha }`);

  var list_pull_requests_associated_with_commit = null;
  
  const response = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner,
    repo,
    commit_sha
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_pull_requests_associated_with_commit = response.data;
  }

  console.log(`list_pull_requests_associated_with_commit=${ JSON.stringify(list_pull_requests_associated_with_commit, null, 2) }`);
  return list_pull_requests_associated_with_commit;
}

async function listReviewComments(octokit, owner, repo, pull_number) {
  console.log(`owner=${ owner }, repo=${ repo }, pull_number=${ pull_number }`);

  var list_review_comments = null;
  
  const response = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pull_number
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_review_comments = response.data;
  }

  console.log(`list_review_comments=${ JSON.stringify(list_review_comments, null, 2) }`);
  return list_review_comments;
}

async function listReviews(octokit, owner, repo, pull_number) {
  console.log(`owner=${ owner }, repo=${ repo }, pull_number=${ pull_number }`);

  var list_reviews = null;
  
  const response = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pull_number
  });
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    list_reviews = response.data;
  }

  console.log(`list_reviews=${ JSON.stringify(list_reviews, null, 2) }`);
  return list_reviews;
}

module.exports = {
  createRef,
  createTag,
  deleteRef,
  deleteSliceOfTags,
  deleteTags,
  getBranch,
  getCommit,
  getPullRequest,
  getPullsList,
  getTags,
  listComments,
  listCommentsForCommit,
  listPullRequestsAssociatedWithCommit,
  listReviewComments,
  listReviews
};