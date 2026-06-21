import React from "react";
import { FaGithub, FaLinkedin, FaGlobe, FaGitlab, FaBitbucket, FaStackOverflow, FaHackerrank, FaInstagram, FaFacebook, FaLink } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { SocialLinkPlatform } from "./constants";

export const getSocialIcon = (platform: string): React.ReactElement => {
  switch (platform) {
    case SocialLinkPlatform.GITHUB:      return <FaGithub />;
    case SocialLinkPlatform.LINKEDIN:    return <FaLinkedin />;
    case SocialLinkPlatform.PORTFOLIO:   return <FaGlobe />;
    case SocialLinkPlatform.GITLAB:      return <FaGitlab />;
    case SocialLinkPlatform.BITBUCKET:   return <FaBitbucket />;
    case SocialLinkPlatform.STACKOVERFLOW: return <FaStackOverflow />;
    case SocialLinkPlatform.LEETCODE:    return <SiLeetcode />;
    case SocialLinkPlatform.HACKERRANK:  return <FaHackerrank />;
    case SocialLinkPlatform.CODECHEF:    return <SiCodechef />;
    case SocialLinkPlatform.CODEFORCES:  return <SiCodeforces />;
    case SocialLinkPlatform.TWITTER:
    case SocialLinkPlatform.X:           return <FaXTwitter />;
    case SocialLinkPlatform.INSTAGRAM:   return <FaInstagram />;
    case SocialLinkPlatform.FACEBOOK:    return <FaFacebook />;
    default:                             return <FaLink />;
  }
};
