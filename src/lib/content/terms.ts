import { appConfig } from 'config';
import { ContentItem } from 'types/content';

const { businessName, businessNameShort } = appConfig;

export default <ContentItem[]>[
  {
    text:
      'Revised 9 May, 2020' +
      '\n\n' +
      'This is a binding Agreement between ' +
      businessName +
      '. ("' +
      businessNameShort +
      '" or "We") and the person, persons, or entity ' +
      '("You" or "Your") using the service, Software, or application ("Software").' +
      '\n\n' +
      'RIGHTS AND OBLIGATIONS' +
      '\n\n' +
      businessNameShort +
      ' provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and ' +
      'comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent ' +
      'and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or ' +
      'other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization ' +
      'or other legal entity and bind them to these terms.' +
      '\n\n' +
      'This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or ' +
      'other third parties serve as financial intermediaries or custodians of Your crypto-currency tokens.' +
      '\n\n' +
      'While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We ' +
      'cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in ' +
      'compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, Passcodes, and any other codes You ' +
      'use to access the Software.' +
      '\n\n' +
      'IF YOU LOSE ACCESS TO YOUR WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING ' +
      'PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY TOKENS/COINS YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction ' +
      'requests are irreversible. The authors of the Software, employees and affiliates of ' +
      businessNameShort +
      ', copyright holders, and ' +
      businessNameShort +
      ' cannot ' +
      'retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control ' +
      'over any crypto-currency network.' +
      '\n\n' +
      'DISCLAIMER' +
      '\n\n' +
      'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF ' +
      'MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES ' +
      'OF ' +
      businessNameShort +
      ', COPYRIGHT HOLDERS, OR ' +
      businessName.toUpperCase() +
      ' BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT ' +
      'OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.' +
      '\n\n' +
      'IN NO EVENT WILL ' +
      businessName.toUpperCase() +
      ' PAY OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ' +
      'ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR ' +
      'GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY ' +
      'TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT ' +
      'COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE ' +
      'DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS ' +
      'OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.' +
      '\n\n' +
      'INTELLECTUAL PROPERTY' +
      '\n\n' +
      'We retain all right, title, and interest in and to the Content and all of ' +
      businessNameShort +
      ' brands, logos, and trademarks, including, but not ' +
      'limited to, ' +
      businessNameShort +
      ', ' +
      businessNameShort +
      ' Wallet, ' +
      businessNameShort +
      ' Wallet app and variations of the wording of the aforementioned brands, logos, and ' +
      'trademarks.' +
      '\n\n' +
      'CHOICE OF LAW' +
      '\n\n' +
      'This Agreement, and its application and interpretation, shall be governed exclusively by the laws of the State of New York, without regard to ' +
      'its conflict of law rules. You consent to the exclusive jurisdiction of the federal and state courts located in or near New York, New York for ' +
      'any dispute arising under this Agreement.' +
      '\n\n' +
      'SEVERABILITY' +
      '\n\n' +
      'In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration shall not invalidate the entire ' +
      'agreement and all other paragraphs of the Agreement shall remain in full force and effect.' +
      '\n\n' +
      'BINDING AGREEMENT' +
      '\n\n' +
      'The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other representatives. This Agreement may be ' +
      'executed in counterparts, each of which shall be considered to be an original, but both of which constitute the same Agreement. ' +
      '\n\n' +
      'You assume any and all risks associated with the use of the Software. We reserve the right to modify this Agreement from time to time.',
  },
];
