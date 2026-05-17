import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    let output = '';

    // Mock execution for the new languages
    if (language === 'go') {
      if (code.includes('fmt.Println')) {
        const matches = code.match(/fmt.Println\("(.*?)"\)/g);
        if (matches) {
          output = matches.map((m: string) => m.replace(/fmt.Println\("/, '').replace(/"\)/, '')).join('\n');
        } else {
          output += "Go program executed successfully.\\n";
        }
      } else {
         output += "Go program executed successfully.\\n";
      }
    } else if (language === 'ruby') {
      if (code.includes('puts ')) {
        const matches = code.match(/puts "(.*?)"/g);
        if (matches) {
          output = matches.map((m: string) => m.replace(/puts "/, '').replace(/"/, '')).join('\n');
        } else {
          output += "Ruby program executed successfully.\\n";
        }
      } else {
        output += "Ruby program executed successfully.\\n";
      }
    } else if (language === 'dart') {
      if (code.includes('print')) {
        const matches = code.match(/print\('(.*?)'\)/g);
        if (matches) {
          output = matches.map((m: string) => m.replace(/print\('/, '').replace(/'\)/, '')).join('\n');
        } else {
          output += "Dart program executed successfully.\\n";
        }
      } else {
         output += "Dart program executed successfully.\\n";
      }
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    // Artificial delay to simulate sandbox execution
    await new Promise(r => setTimeout(r, 600));

    return NextResponse.json({ output });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 });
  }
}
