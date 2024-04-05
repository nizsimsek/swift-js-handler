import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiGithubFill, RiGoogleLine } from "react-icons/ri";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader className="flex flex-col p-6 space-y-1">
          <CardTitle className="font-semibold tracking-tight text-2xl">
            Login
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Login and access new friends
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <span className="w-full border-t"></span>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="me@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="******" />
          </div>
          <Button>Login</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline" className="px-4 py-2">
              <RiGithubFill size={24} className="mr-2" />
              Github
            </Button>
            <Button variant="outline">
              <RiGoogleLine size={24} className="mr-2" />
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
