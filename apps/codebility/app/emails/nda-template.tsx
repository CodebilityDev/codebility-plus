import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface NdaEmailProps {
  firstName: string;
  ndaLink: string;
}

export const NdaEmailTemplate = ({ firstName, ndaLink }: NdaEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Codebility Plus NDA Signing Request</Preview>
      <Body style={{ 
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f6f9fc",
        margin: "0",
        padding: "0",
      }}>
        <Container style={{ 
          padding: "20px",
          margin: "20px auto",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
        }}>
          <Section style={{ textAlign: "center", marginBottom: "30px", backgroundColor: "black", padding: "20px 0 20px 0" }}>
            <Img
              src="https://codebility.tech/assets/images/codebility.png"
              alt="Codebility Plus Logo"
              width="200"
              height="auto"
              style={{ margin: "0 auto" }}
            />
          </Section>
          
          <Heading style={{ 
            color: "#333",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "30px 0",
            textAlign: "center",
          }}>
            NDA Signing Request
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#444" }}>
            Dear {firstName},
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#444" }}>
            Please sign the Non-Disclosure Agreement by clicking on the button below:
          </Text>
          <Section style={{ textAlign: "center", margin: "80px 0" }}>
            <Button
              href={ndaLink}
              style={{
                backgroundColor: "#4f46e5",
                borderRadius: "5px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
                padding: "12px 20px",
              }}
            >
              Sign NDA
            </Button>
          </Section>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#444" }}>
            If the button doesn&apos;t work, you can also copy and paste this link into your browser:
          </Text>
          <Text style={{ fontSize: "14px", lineHeight: "1.5", color: "#666" }}>
            <Link href={ndaLink} style={{ color: "#4f46e5", textDecoration: "underline" }}>
              {ndaLink}
            </Link>
          </Text>
          <Hr style={{ borderColor: "#e6ebf1", margin: "30px 0" }} />
          <Text style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
            Thank you,<br />
            Codebility Plus Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};