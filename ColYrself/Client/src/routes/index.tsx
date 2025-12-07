import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Video, ScreenShare, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4">
      <section className="flex flex-col items-center justify-center py-24 text-center md:py-32">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Crystal-Clear Video Calls.{" "}
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Finally Simple.
          </span>
        </h1>
        <p className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Host and join high-definition video meetings with anyone, anywhere.{" "}
          <strong className="whitespace-nowrap bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Col Yrself
          </strong> provides reliable, secure, and
          easy-to-use video conferencing for work, school, or just catching up.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link to={user ? "/dashboard" : "/auth/signup"}>
              {user ? "Go to Your Dashboard" : "Get Started for Free"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="http://github.com/bepis0101/ColYrself">Learn More</a>
          </Button>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need for a Great Call
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            All the essential features, with none of the clutter.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="flex flex-col text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Video className="h-6 w-6" />
              </div>
              <CardTitle className="pt-4">HD Video & Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experience crisp, clear video and lag-free audio. Stay
                connected with reliable performance, even in large team meetings.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ScreenShare className="h-6 w-6" />
              </div>
              <CardTitle className="pt-4">Easy Screen Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your entire screen, a specific window, or a browser tab
                with a single click. Perfect for presentations and demos.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="pt-4">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your conversations are your own. We use robust security
                measures to ensure your meetings are safe and confidential.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {!user && (
        <section className="rounded-lg bg-muted py-16 px-6 text-center md:py-24">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Make the Call?
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
            Create your free account today and start hosting meetings in
            minutes. No credit card required.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/auth/signup">Sign Up Now</Link>
          </Button>
        </section>
      )}
      {/* <footer className="py-12 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Col Yrself. All rights reserved.</p>
      </footer> */}
    </main>
  );
}