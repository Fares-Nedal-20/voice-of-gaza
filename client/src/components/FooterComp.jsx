import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function FooterComp() {
  return (
    <Footer container className="bg-gray-50 rounded-xl">
      <div className="w-full text-center">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <FooterBrand
            href="/"
            src="/logo2.png"
            alt="loge"
            name="Voice Of Gaza"
          />
          <FooterLinkGroup>
            <FooterLink as={"div"}>
              <Link to={"/about"}>About</Link>
            </FooterLink>
            <FooterLink as={"div"}>
              <Link to={"#"}>Privacy Policy</Link>
            </FooterLink>
            <FooterLink as={"div"}>
              <Link to={"#"}>Contact</Link>
            </FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright
          href="/"
          by="voice of gaza"
          year={new Date().getFullYear()}
        />
      </div>
    </Footer>
  );
}
