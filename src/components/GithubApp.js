import React, { useState } from 'react';
import './GithubApp.scss';
import MyPieChart from './MyPieChart';
import Button from '@material-ui/core/Button';
import Avatar from './Avatar';

const GithubApp = () => {
    const [username, setUsername] = useState("");
    const [languages, setLanguages] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [errormsg, setErrormsg] = useState("");
    const [userfullname, setUserfullname] = useState("");
    const [avatarsrc, setAvatarsrc] = useState("");
    const [avatarHome, setAvatarHome] = useState("");
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [repos, setRepos] = useState([])
    const [display, setDisplay] = useState(false)

    const myHeaders = new Headers();
    const authHeader = "Basic " + btoa(process.env.REACT_APP_GITHUB_CLIENT_ID + ":" + process.env.REACT_APP_GITHUB_CLIENT_SECRET);
    myHeaders.append("Authorization", authHeader);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const handleChange = (event) => {
        setUsername(event.target.value);
    }

    const fetchUser = async () => {
        setFetching(true);
        const resp = await fetch(`https://api.github.com/users/${username}`, requestOptions);
        const user = await resp.json();
        if (user) {
            console.log(user)
            setUserfullname(user.name);
            setAvatarsrc(user.avatar_url);
            setAvatarHome(user.html_url);
            setFollowers(user.followers);
            setFollowing(user.following);
        } else {
            setErrormsg("Not a valid user");
        }

        fetchUserdetails();
        setFetching(false);
    }

    const fetchUserdetails = async () => {
        setFetching(true);
        const resp = await fetch(`https://api.github.com/users/${username}/repos`, requestOptions);
        const userRepositories = await resp.json();
        console.log(userRepositories)
        if (userRepositories && userRepositories.length > 0) {
            setRepos(userRepositories)
            const languageMap = new Map();
            userRepositories.forEach((repo) => {
                if (repo.language) {
                    if (languageMap.has(repo.language)) {
                        languageMap.set(repo.language, languageMap.get(repo.language) + 1);
                    } else {
                        languageMap.set(repo.language, 1);
                    }
                }
            });
            setLanguages([]);
            const l = [];
            l.push(["Languages", "Count"]);
            languageMap.forEach((value, key) => {
                l.push([key, value]);

            });
            setLanguages(languages => l);
        } else {
            setErrormsg("Not a valid user");
        }
        setFetching(false);
    }

    const toggleDisplay = (e) => {
        e.preventDefault()
        setDisplay(!display)
        console.log(display)
    }

    const repoRender = () => {
        return (
            <div>
                <h4>User Repo List</h4>
                <ol>
                    {repos.map(repo =>
                        <li key={repo.name}>
                            <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>{repo.name}</a>
                        </li>
                    )}
                </ol>
            </div>
        )
    }

    return (
        <div className="container">
            <h3>What coding language(s) does User code in?</h3>
            <p>(based on user's contributions to public Github repositories)</p>
            <input
                type="text"
                placeholder="Enter User's Github username"
                value={username}
                onChange={handleChange}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={fetchUser}
            >
                Fetch
            </Button>
            <div>
                {errormsg}
            </div>
            <div>
                {languages.length > 0 && !fetching
                    &&
                    <div>
                        <div>
                            {
                                avatarsrc &&
                                <Avatar src={avatarsrc} home={avatarHome} />
                            }
                            {
                                userfullname &&
                                <span><br />{userfullname}</span>
                            }
                            {
                                followers &&
                                <p>Followers: {followers}</p>
                            }
                            {
                                following &&
                                <p>Following {following}</p>
                            }
                        </div>
                        <MyPieChart languages={languages} userfullname={userfullname} />
                    </div>
                }
            </div>
            <div>
                {
                    !display &&
                    <button className='repoButton' onClick={(e) => toggleDisplay(e)}>See User Repos</button>
                }
                {
                    display &&
                    <button className='repoButton' onClick={(e) => toggleDisplay(e)}>Hide Repos</button>
                }
                {
                    display &&
                    repoRender()
                }
            </div>

        </div>
    )
};

export default GithubApp;
