1. Squash all commits into one 
- create backup branch :
    - git branch --orphan new-start
- reset main to initial commit:
    - git reset --hard $(git rev-list --max-parents=0 HEAD)
- apply the new-start files into main
    - git reset --hard new-start
- force push
    - git push origin main --force

2. remove all branches except main
    - git branch | grep -v "main" | xargs git branch -D
