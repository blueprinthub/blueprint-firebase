/* eslint-disable require-jsdoc */
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";
import axios from "axios";
import {PlatformName} from "../../domain/entities/platform.enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JiraTask = {
  fields:{
    summary:string;
    description:string;
    created:string;
    updated:string;
    project:{
      name:string;
      avatarUrls:Record<string, string>
    },
    creator:{
      avatarUrls:Record<string, string>,
      displayName:string
    }
  }
};

export class JiraRemoteRepository extends AbstractRemoteRepository<JiraTask> {
  private CLOUDS_API_URL="https://api.atlassian.com/oauth/token/accessible-resources";

  private buildHeaders(accessToken:string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
  }

  private buildSearchUrl(cloudId:string) {
    return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?jql=assignee=currentuser() AND status!=Done`;
  }

  private async getCloudIds(accessToken:string):Promise<string[]> {
    const {data: clouds} = await axios.get<{id:string}[]>(this.CLOUDS_API_URL, {
      headers: this.buildHeaders(accessToken),
    });
    return clouds.map((cloud) => cloud.id);
  }


  async getTasks(accessToken: string): Promise<JiraTask[]> {
    console.log({accessToken});
    const clouds = await this.getCloudIds(accessToken);
    console.log({clouds});
    const jiraTasks = clouds.map(async (cloudId) => {
      const searchUrl = this.buildSearchUrl(cloudId);
      const {data} = await axios.get<{issues:JiraTask[]}>(searchUrl, {
        headers: this.buildHeaders(accessToken),
      });
      return data.issues;
    });
    const tasksPerCloud = await Promise.all(jiraTasks);
    console.log({tasksPerCloud});
    return tasksPerCloud.flat();
  }
  mapper(remote: JiraTask): Task {
    const {fields} = remote;
    return {
      title: fields.summary,
      description: fields.description,
      isCompleted: false,
      createdAt: new Date(fields.created),
      updatedAt: new Date(fields.updated),
      permalink: "testtest",
      startDate: new Date(),
      loggedTime: 0,
      priority: 3,
      project: {
        platformName: PlatformName.Jira,
        name: fields.project.name,
        iconUrl: fields.project.avatarUrls["48x48"],
      },
      creator: {
        permalink: "blabla",
        displayName: fields.creator.displayName,
        iconUrl: fields.creator.avatarUrls["48x48"],
      },
      assigned: [],
    };
  }
}
