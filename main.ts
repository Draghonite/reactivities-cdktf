import { LightsailInstance } from './.gen/providers/aws/lightsail-instance/index';
import { AwsProvider } from './.gen/providers/aws/provider/index';
import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import * as fs from "fs";
import * as path from "path";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new AwsProvider(this, "AWS", {
        region: "us-east-1"
    });

    const instance = new LightsailInstance(this, "ReactivitiesLightsailInstance", {
        name: "Reactivities",
        availabilityZone: "us-east-1b",
        blueprintId: "ubuntu_20_04",
        bundleId: "nano_2_0",
        tags: {
            "AplicationId": "Reactivities"
        },
        userData: fs.readFileSync(path.join(__dirname, "./assets/user_data.sh"), "utf-8")
    });

    new TerraformOutput(this, "ReactivitiesPublicIP", {
        value: instance.publicIpAddress
    });
  }
}

const app = new App();
new MyStack(app, "reactivities-cdktf");
app.synth();
